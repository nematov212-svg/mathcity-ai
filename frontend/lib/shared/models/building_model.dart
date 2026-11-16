class BuildingModel {
  final String key;
  final String name;
  final String category;
  final int costInCoins;
  final int requiredLevel;
  final String description;
  final String iconName;
  final String mode;
  final bool isUnlocked;
  final bool canAfford;
  final bool isAlreadyBuilt;

  BuildingModel({
    required this.key,
    required this.name,
    required this.category,
    required this.costInCoins,
    required this.requiredLevel,
    required this.description,
    required this.iconName,
    required this.mode,
    this.isUnlocked = true,
    this.canAfford = true,
    this.isAlreadyBuilt = false,
  });

  factory BuildingModel.fromJson(Map<String, dynamic> json) {
    return BuildingModel(
      key: json['key'] ?? '',
      name: json['name'] ?? '',
      category: json['category'] ?? '',
      costInCoins: json['costInCoins'] ?? 100,
      requiredLevel: json['requiredLevel'] ?? 1,
      description: json['description'] ?? '',
      iconName: json['iconName'] ?? 'home',
      mode: json['mode'] ?? 'KIDS',
      isUnlocked: json['isUnlocked'] ?? true,
      canAfford: json['canAfford'] ?? true,
      isAlreadyBuilt: json['isAlreadyBuilt'] ?? false,
    );
  }
}

class PlacedBuildingModel {
  final String buildingKey;
  final String name;
  final String iconName;
  final int gridX;
  final int gridY;

  PlacedBuildingModel({
    required this.buildingKey,
    required this.name,
    required this.iconName,
    required this.gridX,
    required this.gridY,
  });

  factory PlacedBuildingModel.fromJson(Map<String, dynamic> json) {
    return PlacedBuildingModel(
      buildingKey: json['buildingKey'] ?? '',
      name: json['name'] ?? '',
      iconName: json['iconName'] ?? 'home',
      gridX: json['gridX'] ?? 0,
      gridY: json['gridY'] ?? 0,
    );
  }
}
