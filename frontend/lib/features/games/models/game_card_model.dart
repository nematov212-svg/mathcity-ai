/// Model representing a game card in the Games section
class GameCardModel {
  final String id;
  final String title;
  final String description;
  final String badge;
  final String? imageAsset;
  final String route;
  final bool isAvailable;

  const GameCardModel({
    required this.id,
    required this.title,
    required this.description,
    required this.badge,
    this.imageAsset,
    required this.route,
    this.isAvailable = true,
  });
}
