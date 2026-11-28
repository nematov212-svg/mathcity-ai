import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../models/game_card_model.dart';
import '../models/game_config.dart';
import '../widgets/game_card.dart';
import '../widgets/game_colors.dart';
import 'game_setup_sheet.dart';

/// Available games catalog list for the Games section
const List<GameCardModel> kHomeGamesList = [
  GameCardModel(
    id: 'tug_of_war',
    title: 'Arqon tortish',
    description:
        'Jamoaviy savol-javob o‘yini. Ikki jamoa raqobatlashadi, to‘g‘ri va tez javob bergan jamoa g‘olib bo‘ladi.',
    badge: 'Ro‘yxatdan o‘tmasdan',
    route: '/games/tug-of-war',
    isAvailable: true,
  ),
];

/// "O‘yinlar" section displayed in the Home Screen below "Bugungi vazifalar"
class GamesSection extends StatelessWidget {
  const GamesSection({super.key});

  void _openGameWizard(BuildContext context, GameCardModel game) {
    if (game.id == 'tug_of_war') {
      GameSetupSheet.show(
        context,
        initialConfig: const GameConfig(),
        onStartGame: (config) {
          context.push('/games/tug-of-war', extra: config);
        },
      );
    } else {
      context.push(game.route);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = GameColors.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Section Header: "O‘yinlar" | "Tez orada ko‘proq"
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Expanded(
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(6),
                      decoration: BoxDecoration(
                        color: colors.primaryBlue.withValues(alpha: 0.12),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Icon(
                        Icons.sports_esports_rounded,
                        size: 20,
                        color: colors.primaryBlue,
                      ),
                    ),
                    const SizedBox(width: 8),
                    Flexible(
                      child: Text(
                        'O‘yinlar',
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: colors.textPrimary,
                          letterSpacing: -0.3,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 8),
              Flexible(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    'Tez orada ko‘proq',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: colors.textMuted,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 12),

        // List of Games Cards
        Column(
          children: [
            for (int i = 0; i < kHomeGamesList.length; i++) ...[
              if (i > 0) const SizedBox(height: 14),
              GameCard(
                model: kHomeGamesList[i],
                onStart: () => _openGameWizard(context, kHomeGamesList[i]),
              ),
            ],
          ],
        ),
      ],
    );
  }
}
