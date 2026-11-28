import 'package:flutter/material.dart';
import '../models/game_config.dart';
import '../widgets/game_colors.dart';
import '../widgets/option_card.dart';
import '../widgets/wizard_stepper.dart';

/// Full-screen modal setup sheet for configuring Tug of War teams & options
class GameSetupSheet extends StatefulWidget {
  final GameConfig initialConfig;
  final ValueChanged<GameConfig> onStartGame;

  const GameSetupSheet({
    super.key,
    this.initialConfig = const GameConfig(),
    required this.onStartGame,
  });

  static Future<void> show(
    BuildContext context, {
    GameConfig initialConfig = const GameConfig(),
    required ValueChanged<GameConfig> onStartGame,
  }) {
    final isDesktop = MediaQuery.of(context).size.width >= 600;

    if (isDesktop) {
      return showDialog(
        context: context,
        builder: (ctx) => Dialog(
          backgroundColor: Colors.transparent,
          insetPadding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 560, maxHeight: 720),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(28),
              child: GameSetupSheet(
                initialConfig: initialConfig,
                onStartGame: onStartGame,
              ),
            ),
          ),
        ),
      );
    }

    return showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.92,
        minChildSize: 0.6,
        maxChildSize: 0.96,
        builder: (context, scrollController) => ClipRRect(
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
          child: GameSetupSheet(
            initialConfig: initialConfig,
            onStartGame: onStartGame,
          ),
        ),
      ),
    );
  }

  @override
  State<GameSetupSheet> createState() => _GameSetupSheetState();
}

class _GameSetupSheetState extends State<GameSetupSheet> {
  int _currentStep = 0; // 0: Time, 1: Operations, 2: Range, 3: Teams

  late int? _durationMinutes;
  late Set<MathOperation> _selectedOperations;
  late NumberRange _selectedRange;
  late final TextEditingController _team1Ctrl;
  late final TextEditingController _team2Ctrl;

  String? _teamError;

  @override
  void initState() {
    super.initState();
    _durationMinutes = widget.initialConfig.durationMinutes;
    _selectedOperations = Set.from(widget.initialConfig.operations);
    if (_selectedOperations.isEmpty) {
      _selectedOperations.add(MathOperation.addition);
    }
    _selectedRange = widget.initialConfig.numberRange;
    _team1Ctrl = TextEditingController(text: widget.initialConfig.team1Name);
    _team2Ctrl = TextEditingController(text: widget.initialConfig.team2Name);
  }

  @override
  void dispose() {
    _team1Ctrl.dispose();
    _team2Ctrl.dispose();
    super.dispose();
  }

  void _nextStep() {
    if (_currentStep == 1 && _selectedOperations.isEmpty) {
      return;
    }
    if (_currentStep < 3) {
      setState(() => _currentStep++);
    } else {
      _submit();
    }
  }

  void _prevStep() {
    if (_currentStep > 0) {
      setState(() => _currentStep--);
    }
  }

  void _submit() {
    final t1 = _team1Ctrl.text.trim().isEmpty ? 'Ko‘k jamoa' : _team1Ctrl.text.trim();
    final t2 = _team2Ctrl.text.trim().isEmpty ? 'Qizil jamoa' : _team2Ctrl.text.trim();

    if (t1.toLowerCase() == t2.toLowerCase()) {
      setState(() {
        _teamError = 'Jamoalar nomi har xil bo‘lishi kerak!';
      });
      return;
    }

    final finalConfig = GameConfig(
      durationMinutes: _durationMinutes,
      operations: _selectedOperations,
      numberRange: _selectedRange,
      team1Name: t1,
      team2Name: t2,
    );

    Navigator.of(context).pop();
    widget.onStartGame(finalConfig);
  }

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);
    final bottomInset = MediaQuery.of(context).viewInsets.bottom;

    return Container(
      color: colors.cardBackground,
      child: SafeArea(
        top: false,
        child: Padding(
          padding: EdgeInsets.only(bottom: bottomInset),
          child: Column(
            children: [
              // Drag Handle
              Container(
                margin: const EdgeInsets.only(top: 10, bottom: 6),
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: colors.border,
                  borderRadius: BorderRadius.circular(10),
                ),
              ),

              // Title and Close
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const SizedBox(width: 40),
                    Expanded(
                      child: Text(
                        'Jamoalarni tayyorlash',
                        textAlign: TextAlign.center,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: colors.primaryBlue,
                        ),
                      ),
                    ),
                    IconButton(
                      onPressed: () => Navigator.of(context).pop(),
                      icon: Icon(Icons.close_rounded, color: colors.textMuted),
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 6),

              // Stepper
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                child: WizardStepper(currentStep: _currentStep),
              ),

              const SizedBox(height: 12),
              Divider(height: 1, thickness: 1, color: colors.border),

              // Step Content Area with AnimatedSwitcher
              Expanded(
                child: SingleChildScrollView(
                  physics: const BouncingScrollPhysics(),
                  padding: const EdgeInsets.all(18),
                  child: AnimatedSwitcher(
                    duration: const Duration(milliseconds: 250),
                    transitionBuilder: (child, anim) => FadeTransition(
                      opacity: anim,
                      child: SlideTransition(
                        position: Tween<Offset>(
                          begin: const Offset(0.04, 0),
                          end: Offset.zero,
                        ).animate(anim),
                        child: child,
                      ),
                    ),
                    child: _buildCurrentStep(colors),
                  ),
                ),
              ),

              // Bottom Section: Info Box & Action Buttons
              _buildBottomBar(colors),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildCurrentStep(GameColors colors) {
    switch (_currentStep) {
      case 0:
        return _buildStepTime(colors);
      case 1:
        return _buildStepOperations(colors);
      case 2:
        return _buildStepNumberRange(colors);
      case 3:
        return _buildStepTeams(colors);
      default:
        return const SizedBox.shrink();
    }
  }

  // STEP 1: TIME
  Widget _buildStepTime(GameColors colors) {
    return Column(
      key: const ValueKey('step_0_time'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'O‘yin vaqti',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: colors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'O‘yin qancha davom etishini belgilang',
          style: TextStyle(fontSize: 12, color: colors.textSecondary),
        ),
        const SizedBox(height: 14),

        // Grid of 4 minute options
        GridView.count(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          crossAxisCount: 2,
          mainAxisSpacing: 10,
          crossAxisSpacing: 10,
          childAspectRatio: 2.2,
          children: [
            _buildTimeOption(1, '1 daqiqa', colors),
            _buildTimeOption(3, '3 daqiqa', colors),
            _buildTimeOption(5, '5 daqiqa', colors),
            _buildTimeOption(10, '10 daqiqa', colors),
          ],
        ),

        const SizedBox(height: 10),

        // Cheksiz (Infinite) option - full width
        OptionCard(
          title: 'Cheksiz (∞)',
          subtitle: 'G‘olib aniqlanguncha davom etadi',
          icon: Icons.all_inclusive_rounded,
          isSelected: _durationMinutes == null,
          onTap: () => setState(() => _durationMinutes = null),
          isFullWidth: true,
        ),
      ],
    );
  }

  Widget _buildTimeOption(int minutes, String label, GameColors colors) {
    final isSelected = _durationMinutes == minutes;
    return OptionCard(
      title: label,
      icon: Icons.timer_outlined,
      isSelected: isSelected,
      onTap: () => setState(() => _durationMinutes = minutes),
    );
  }

  // STEP 2: OPERATIONS
  Widget _buildStepOperations(GameColors colors) {
    final hasNoSelection = _selectedOperations.isEmpty;

    return Column(
      key: const ValueKey('step_1_ops'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Amallar',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: colors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Bir yoki bir nechta amallarni tanlang',
          style: TextStyle(fontSize: 12, color: colors.textSecondary),
        ),
        const SizedBox(height: 14),

        ...MathOperation.values.map((op) {
          final isSelected = _selectedOperations.contains(op);
          return Padding(
            padding: const EdgeInsets.only(bottom: 8),
            child: OptionCard(
              title: '${op.label} (${op.symbol})',
              icon: op.icon,
              isSelected: isSelected,
              onTap: () {
                setState(() {
                  if (isSelected) {
                    _selectedOperations.remove(op);
                  } else {
                    _selectedOperations.add(op);
                  }
                });
              },
            ),
          );
        }),

        if (hasNoSelection) ...[
          const SizedBox(height: 6),
          const Row(
            children: [
              Icon(Icons.info_outline_rounded,
                  color: Color(0xFFEF4444), size: 16),
              SizedBox(width: 6),
              Text(
                'Kamida bitta amalni tanlashingiz shart!',
                style: TextStyle(
                  color: Color(0xFFEF4444),
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ],
    );
  }

  // STEP 3: NUMBER RANGE
  Widget _buildStepNumberRange(GameColors colors) {
    return Column(
      key: const ValueKey('step_2_range'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Sonlar xonasini tanlang',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: colors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'Savollarda ishlatiladigan sonlar nechta xonali bo‘lsin?',
          style: TextStyle(fontSize: 12, color: colors.textSecondary),
        ),
        const SizedBox(height: 14),

        ...NumberRange.values.map((range) {
          final isSelected = _selectedRange == range;
          return Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: OptionCard(
              title: range.rangeText,
              subtitle: range.label,
              icon: Icons.pin_outlined,
              isSelected: isSelected,
              onTap: () => setState(() => _selectedRange = range),
            ),
          );
        }),
      ],
    );
  }

  // STEP 4: TEAMS
  Widget _buildStepTeams(GameColors colors) {
    return Column(
      key: const ValueKey('step_3_teams'),
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Jamoalar nomini kiriting',
          style: TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: colors.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          'O‘yinchilar uchun jamoa nomlarini tanlang',
          style: TextStyle(fontSize: 12, color: colors.textSecondary),
        ),
        const SizedBox(height: 16),

        // Team 1 Card (Blue)
        _buildTeamNameCard(
          teamNumber: 1,
          label: '1-jamoa',
          controller: _team1Ctrl,
          color: colors.blueTeam,
          bgColor: colors.blueTeamBg,
          isDark: colors.isDark,
        ),

        // Center VS Badge
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 10),
          child: Center(
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: Colors.amber,
                borderRadius: BorderRadius.circular(12),
                boxShadow: const [
                  BoxShadow(
                    color: Colors.black26,
                    blurRadius: 6,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: const Text(
                'VS',
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: Colors.black87,
                ),
              ),
            ),
          ),
        ),

        // Team 2 Card (Red)
        _buildTeamNameCard(
          teamNumber: 2,
          label: '2-jamoa',
          controller: _team2Ctrl,
          color: colors.redTeam,
          bgColor: colors.redTeamBg,
          isDark: colors.isDark,
        ),

        if (_teamError != null) ...[
          const SizedBox(height: 10),
          Text(
            _teamError!,
            style: const TextStyle(
              color: Color(0xFFEF4444),
              fontSize: 12,
              fontWeight: FontWeight.bold,
            ),
          ),
        ],
      ],
    );
  }

  Widget _buildTeamNameCard({
    required int teamNumber,
    required String label,
    required TextEditingController controller,
    required Color color,
    required Color bgColor,
    required bool isDark,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: color.withValues(alpha: 0.4), width: 1.5),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 12,
                height: 12,
                decoration: BoxDecoration(color: color, shape: BoxShape.circle),
              ),
              const SizedBox(width: 8),
              Text(
                label,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: color,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          TextField(
            controller: controller,
            maxLength: 16,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w700,
              color: isDark ? Colors.white : const Color(0xFF0F172A),
            ),
            decoration: InputDecoration(
              counterText: '',
              hintText: teamNumber == 1 ? 'Ko‘k jamoa' : 'Qizil jamoa',
              filled: true,
              fillColor: isDark ? const Color(0xFF151A2B) : Colors.white,
              contentPadding:
                  const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: color.withValues(alpha: 0.3)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(12),
                borderSide: BorderSide(color: color, width: 2),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar(GameColors colors) {
    final canProceed =
        !(_currentStep == 1 && _selectedOperations.isEmpty);

    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 12),
      decoration: BoxDecoration(
        color: colors.cardBackground,
        border: Border(top: BorderSide(color: colors.border)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          // "Matematika demo o'yini haqida" block (Cleaned from debug text)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            decoration: BoxDecoration(
              color: colors.borderSubtle,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              children: [
                Icon(Icons.info_outline_rounded,
                    size: 16, color: colors.textMuted),
                const SizedBox(width: 8),
                Expanded(
                  child: Text(
                    'Arifmetik amallar, mantiqiy mashqlar va sonlarni taqqoslash bo‘yicha o‘yin.',
                    style: TextStyle(
                      fontSize: 11,
                      color: colors.textMuted,
                      height: 1.3,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 12),

          // Action Buttons: Ortga & Keyingi / Boshlash
          Row(
            children: [
              if (_currentStep > 0) ...[
                Expanded(
                  flex: 1,
                  child: OutlinedButton(
                    onPressed: _prevStep,
                    style: OutlinedButton.styleFrom(
                      foregroundColor: colors.textPrimary,
                      side: BorderSide(color: colors.border),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(14)),
                    ),
                    child: const Text('Ortga',
                        style: TextStyle(fontWeight: FontWeight.bold)),
                  ),
                ),
                const SizedBox(width: 10),
              ],
              Expanded(
                flex: 2,
                child: ElevatedButton(
                  onPressed: canProceed ? _nextStep : null,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: colors.primaryBlue,
                    foregroundColor: Colors.white,
                    disabledBackgroundColor:
                        colors.primaryBlue.withValues(alpha: 0.35),
                    disabledForegroundColor: Colors.white70,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(14)),
                    elevation: canProceed ? 3 : 0,
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      if (_currentStep == 3)
                        const Icon(Icons.play_arrow_rounded, size: 20),
                      if (_currentStep == 3) const SizedBox(width: 6),
                      Text(
                        _currentStep == 3 ? 'Boshlash' : 'Keyingi →',
                        style: const TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w800,
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
    );
  }
}
