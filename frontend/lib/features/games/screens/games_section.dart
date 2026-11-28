import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../../core/responsive/screen_size.dart';
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
        'Jamoaviy savol-javob o‘yini. Ikki jamoa raqobatlashadi va bilimini sinaydi.',
    badge: 'Ro‘yxatdan o‘tmasdan',
    route: '/games/tug-of-war',
    isAvailable: true,
    isLocked: false,
  ),
  GameCardModel(
    id: 'quick_math',
    title: 'Tezkor hisob',
    description:
        'Tezlik va chaqqonlik o‘yini. Vaqt tugaguncha maksimal misol yeching.',
    badge: 'Tez kunda',
    route: '/games/quick-math',
    isAvailable: false,
    isLocked: true,
  ),
  GameCardModel(
    id: 'number_battle',
    title: 'Sonlar jangi',
    description:
        'Strategik matematik jang. Raqamlarni to‘g‘ri tanlang va g‘olib bo‘ling.',
    badge: 'Tez kunda',
    route: '/games/number-battle',
    isAvailable: false,
    isLocked: true,
  ),
];

/// "O‘yinlar" section displayed in the Home Screen below "Bugungi vazifalar"
/// Snap horizontal carousel with ~84% card width peek
class GamesSection extends StatefulWidget {
  const GamesSection({super.key});

  @override
  State<GamesSection> createState() => _GamesSectionState();
}

class _GamesSectionState extends State<GamesSection> {
  late final PageController _pageController;
  int _activePage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController(viewportFraction: 0.85);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _onGameTap(BuildContext context, GameCardModel game) {
    if (game.isLocked) {
      ScaffoldMessenger.of(context).hideCurrentSnackBar();
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(
            '«${game.title}» o‘yini tez orada taqdim etiladi! 🚀',
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          duration: const Duration(seconds: 2),
        ),
      );
      return;
    }

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
    final isCompact = context.isCompact;

    final header = Padding(
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
    );

    // Telefonda (compact) karkas va gorizontal karusel AYNAN o'zgarmaydi
    if (isCompact) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          header,
          const SizedBox(height: 12),
          // Snap Horizontal Carousel
          SizedBox(
            height: 350,
            child: PageView.builder(
              controller: _pageController,
              padEnds: false,
              physics: const BouncingScrollPhysics(),
              itemCount: kHomeGamesList.length,
              onPageChanged: (idx) {
                setState(() {
                  _activePage = idx;
                });
              },
              itemBuilder: (context, index) {
                final game = kHomeGamesList[index];
                return Padding(
                  padding: EdgeInsets.only(
                    right: index == kHomeGamesList.length - 1 ? 0 : 12,
                  ),
                  child: GameCard(
                    model: game,
                    onStart: () => _onGameTap(context, game),
                  ),
                );
              },
            ),
          ),
          // Carousel Page Indicator Dots
          const SizedBox(height: 8),
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: List.generate(
                kHomeGamesList.length,
                (index) => AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  margin: const EdgeInsets.symmetric(horizontal: 3),
                  width: _activePage == index ? 16 : 6,
                  height: 6,
                  decoration: BoxDecoration(
                    color: _activePage == index
                        ? colors.primaryBlue
                        : colors.border,
                    borderRadius: BorderRadius.circular(3),
                  ),
                ),
              ),
            ),
          ),
        ],
      );
    }

    // Tablet (medium: 2 cols) & Desktop (expanded: 3 cols) grid
    final crossAxisCount = context.isExpanded ? 3 : 2;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        header,
        const SizedBox(height: 16),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: crossAxisCount,
            crossAxisSpacing: 16,
            mainAxisSpacing: 16,
            childAspectRatio: 0.92,
          ),
          itemCount: kHomeGamesList.length,
          itemBuilder: (context, index) {
            final game = kHomeGamesList[index];
            return GameCard(
              model: game,
              onStart: () => _onGameTap(context, game),
            );
          },
        ),
      ],
    );
  }
}
