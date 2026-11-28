import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:go_router/go_router.dart';
import '../logic/tug_of_war_controller.dart';
import '../models/game_config.dart';
import '../widgets/game_colors.dart';
import '../widgets/team_panel.dart';
import '../widgets/tug_scene.dart';
import 'game_result_dialog.dart';
import 'game_setup_sheet.dart';

/// Full-screen Tug of War game screen (split-screen multi-touch math battle)
class TugOfWarScreen extends StatefulWidget {
  final GameConfig config;

  const TugOfWarScreen({
    super.key,
    this.config = const GameConfig(),
  });

  @override
  State<TugOfWarScreen> createState() => _TugOfWarScreenState();
}

class _TugOfWarScreenState extends State<TugOfWarScreen>
    with WidgetsBindingObserver {
  late TugOfWarController _controller;
  late GameConfig _currentConfig;

  final GlobalKey<TeamPanelState> _team1PanelKey = GlobalKey<TeamPanelState>();
  final GlobalKey<TeamPanelState> _team2PanelKey = GlobalKey<TeamPanelState>();

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _currentConfig = widget.config;
    _initGame();
  }

  void _initGame() {
    _controller = TugOfWarController(
      config: _currentConfig,
      onGameFinished: _handleGameFinished,
    );
  }

  void _handleGameFinished(GameResult result) {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      HapticFeedback.heavyImpact();
      GameResultDialog.show(
        context,
        result: result,
        onPlayAgain: () {
          setState(() {
            _initGame();
          });
        },
        onChangeSettings: () {
          GameSetupSheet.show(
            context,
            initialConfig: _currentConfig,
            onStartGame: (newConfig) {
              setState(() {
                _currentConfig = newConfig;
                _initGame();
              });
            },
          );
        },
        onGoHome: () {
          if (mounted) {
            context.pop();
          }
        },
      );
    });
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.paused) {
      _controller.pauseTimer();
    } else if (state == AppLifecycleState.resumed) {
      _controller.resumeTimer();
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _controller.dispose();
    super.dispose();
  }

  Future<bool> _confirmExit() async {
    final colors = GameColors.of(context);
    _controller.pauseTimer();

    final result = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: colors.cardBackground,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
        title: Text(
          'O‘yinni tark etasizmi?',
          style: TextStyle(
            fontSize: 18,
            fontWeight: FontWeight.w800,
            color: colors.textPrimary,
          ),
        ),
        content: Text(
          'Hozirgi o‘yin natijalari bekor qilinadi.',
          style: TextStyle(
            fontSize: 13,
            color: colors.textSecondary,
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: Text(
              'Davom etish',
              style: TextStyle(
                color: colors.primaryBlue,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFFEF4444),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text('Chiqish'),
          ),
        ],
      ),
    );

    if (result != true) {
      _controller.resumeTimer();
      return false;
    }
    return true;
  }

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);

    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, _) async {
        if (didPop) return;
        final shouldPop = await _confirmExit();
        if (shouldPop && mounted) {
          context.pop();
        }
      },
      child: Scaffold(
        backgroundColor: colors.background,
        body: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                child: ListenableBuilder(
                  listenable: _controller,
                  builder: (context, _) {
                    return Column(
                      children: [
                        // A) Top Header Bar: Team 1 | MathCity Logo | Team 2
                        _buildTopBar(colors),

                        const SizedBox(height: 8),

                        // B) Tug Scene Card (Rope, Players, Center Line, Timer)
                        SizedBox(
                          height: 120,
                          child: TugScene(
                            ropeMarker: _controller.ropeMarker,
                            remainingSeconds: _controller.remainingSeconds,
                            elapsedSeconds: _controller.elapsedSeconds,
                            team1: _controller.team1,
                            team2: _controller.team2,
                            isDark: colors.isDark,
                          ),
                        ),

                        const SizedBox(height: 8),

                        // C) Split-Screen Team Interactive Panels
                        Expanded(
                          child: Row(
                            children: [
                              // Team 1 Panel (Blue)
                              Expanded(
                                child: TeamPanel(
                                  key: _team1PanelKey,
                                  team: _controller.team1,
                                  question: _controller.team1Question,
                                  currentInput: _controller.team1Input,
                                  onInputChar: (char) =>
                                      _controller.inputChar(1, char),
                                  onClear: () => _controller.clearInput(1),
                                  onSubmit: () {
                                    final res = _controller.submitAnswer(1);
                                    if (res == AnswerResult.correct) {
                                      _team1PanelKey.currentState?.triggerCorrect();
                                      HapticFeedback.mediumImpact();
                                    } else if (res == AnswerResult.wrong) {
                                      _team1PanelKey.currentState?.triggerWrong();
                                      HapticFeedback.heavyImpact();
                                    }
                                  },
                                  isDark: colors.isDark,
                                ),
                              ),

                              const SizedBox(width: 8),

                              // Team 2 Panel (Red)
                              Expanded(
                                child: TeamPanel(
                                  key: _team2PanelKey,
                                  team: _controller.team2,
                                  question: _controller.team2Question,
                                  currentInput: _controller.team2Input,
                                  onInputChar: (char) =>
                                      _controller.inputChar(2, char),
                                  onClear: () => _controller.clearInput(2),
                                  onSubmit: () {
                                    final res = _controller.submitAnswer(2);
                                    if (res == AnswerResult.correct) {
                                      _team2PanelKey.currentState?.triggerCorrect();
                                      HapticFeedback.mediumImpact();
                                    } else if (res == AnswerResult.wrong) {
                                      _team2PanelKey.currentState?.triggerWrong();
                                      HapticFeedback.heavyImpact();
                                    }
                                  },
                                  isDark: colors.isDark,
                                ),
                              ),
                            ],
                          ),
                        ),

                        const SizedBox(height: 6),

                        // D) Bottom Utility Controls
                        _buildBottomUtilityBar(colors),
                      ],
                    );
                  },
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTopBar(GameColors colors) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
      decoration: BoxDecoration(
        color: colors.cardBackground,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: colors.border, width: 1.2),
        boxShadow: colors.cardShadow,
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Left: Team 1 (Blue)
          Expanded(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: _controller.team1.getPrimaryColor(colors.isDark),
                    shape: BoxShape.circle,
                  ),
                ),
                const SizedBox(width: 5),
                Flexible(
                  child: Text(
                    _controller.team1.name.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: _controller.team1.getPrimaryColor(colors.isDark),
                    ),
                  ),
                ),
                const SizedBox(width: 5),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: _controller.team1
                        .getPrimaryColor(colors.isDark)
                        .withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${_controller.team1.score}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      color: _controller.team1.getPrimaryColor(colors.isDark),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Center: MathCity Logo
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: FittedBox(
              fit: BoxFit.scaleDown,
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: colors.primaryBlue.withValues(alpha: 0.15),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.school_rounded,
                      size: 16,
                      color: colors.primaryBlue,
                    ),
                  ),
                  const SizedBox(width: 4),
                  Text(
                    'MathCity',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      color: colors.textPrimary,
                      letterSpacing: -0.3,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Right: Team 2 (Red)
          Expanded(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: _controller.team2
                        .getPrimaryColor(colors.isDark)
                        .withValues(alpha: 0.15),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Text(
                    '${_controller.team2.score}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w900,
                      color: _controller.team2.getPrimaryColor(colors.isDark),
                    ),
                  ),
                ),
                const SizedBox(width: 5),
                Flexible(
                  child: Text(
                    _controller.team2.name.toUpperCase(),
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w900,
                      color: _controller.team2.getPrimaryColor(colors.isDark),
                    ),
                  ),
                ),
                const SizedBox(width: 5),
                Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: _controller.team2.getPrimaryColor(colors.isDark),
                    shape: BoxShape.circle,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomUtilityBar(GameColors colors) {
    return FittedBox(
      fit: BoxFit.scaleDown,
      alignment: Alignment.center,
      child: SizedBox(
        width: 320,
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            // Exit to Home
            IconButton(
              visualDensity: VisualDensity.compact,
              constraints: const BoxConstraints(minWidth: 36, minHeight: 36),
              onPressed: () async {
                final shouldPop = await _confirmExit();
                if (shouldPop && mounted) {
                  context.pop();
                }
              },
              icon: Icon(Icons.home_outlined, color: colors.textMuted, size: 22),
              tooltip: 'Bosh sahifa',
            ),

            // Quick Rules / Info Pill
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: colors.cardSecondary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.sports_kabaddi_rounded,
                      size: 14, color: colors.primaryBlue),
                  const SizedBox(width: 4),
                  Text(
                    'Arqon tortish',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      color: colors.textSecondary,
                    ),
                  ),
                ],
              ),
            ),

            // Language Indicator Pill
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: colors.cardSecondary,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Text('🇺🇿', style: TextStyle(fontSize: 12)),
                  const SizedBox(width: 4),
                  Text(
                    'UZ',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: colors.textPrimary,
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
}
