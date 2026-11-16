class TaskModel {
  final String key;
  final String title;
  final String description;
  final int targetCount;
  final int currentCount;
  final bool isCompleted;
  final bool claimed;
  final int rewardCoins;
  final int rewardXP;

  TaskModel({
    required this.key,
    required this.title,
    required this.description,
    required this.targetCount,
    required this.currentCount,
    required this.isCompleted,
    required this.claimed,
    required this.rewardCoins,
    required this.rewardXP,
  });

  factory TaskModel.fromJson(Map<String, dynamic> json) {
    return TaskModel(
      key: json['key'] ?? '',
      title: json['title'] ?? '',
      description: json['description'] ?? '',
      targetCount: json['targetCount'] ?? 1,
      currentCount: json['currentCount'] ?? 0,
      isCompleted: json['isCompleted'] ?? false,
      claimed: json['claimed'] ?? false,
      rewardCoins: json['rewardCoins'] ?? 20,
      rewardXP: json['rewardXP'] ?? 25,
    );
  }
}
