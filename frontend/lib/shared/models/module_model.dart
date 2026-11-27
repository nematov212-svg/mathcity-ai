class ModuleModel {
  final String id;
  final int grade;
  final String subject;
  final int part;
  final String title;
  final int orderIndex;
  final bool comingSoon;
  final int lessonCount;
  final int questionCount;
  final int totalMinutes;
  final int percent;
  final int earnedXp;
  final int totalXp;
  final bool isCompleted;

  ModuleModel({
    required this.id,
    required this.grade,
    required this.subject,
    required this.part,
    required this.title,
    required this.orderIndex,
    required this.comingSoon,
    required this.lessonCount,
    required this.questionCount,
    required this.totalMinutes,
    required this.percent,
    required this.earnedXp,
    required this.totalXp,
    this.isCompleted = false,
  });

  factory ModuleModel.fromJson(Map<String, dynamic> json) {
    return ModuleModel(
      id: json['id']?.toString() ?? '',
      grade: json['grade'] is int
          ? json['grade']
          : int.tryParse(json['grade']?.toString() ?? '1') ?? 1,
      subject: json['subject']?.toString() ?? 'Matematika',
      part: json['part'] is int
          ? json['part']
          : int.tryParse(json['part']?.toString() ?? '1') ?? 1,
      title: json['title']?.toString() ?? '',
      orderIndex: json['orderIndex'] is int
          ? json['orderIndex']
          : int.tryParse(json['orderIndex']?.toString() ?? '1') ?? 1,
      comingSoon: json['comingSoon'] == true,
      lessonCount: json['lessonCount'] is int
          ? json['lessonCount']
          : int.tryParse(json['lessonCount']?.toString() ?? '0') ?? 0,
      questionCount: json['questionCount'] is int
          ? json['questionCount']
          : int.tryParse(json['questionCount']?.toString() ?? '0') ?? 0,
      totalMinutes: json['totalMinutes'] is int
          ? json['totalMinutes']
          : int.tryParse(json['totalMinutes']?.toString() ?? '0') ?? 0,
      percent: json['percent'] is int
          ? json['percent']
          : int.tryParse(json['percent']?.toString() ?? '0') ?? 0,
      earnedXp: json['earnedXp'] is int
          ? json['earnedXp']
          : int.tryParse(json['earnedXp']?.toString() ?? '0') ?? 0,
      totalXp: json['totalXp'] is int
          ? json['totalXp']
          : int.tryParse(json['totalXp']?.toString() ?? '0') ?? 0,
      isCompleted: json['isCompleted'] == true,
    );
  }
}
