class LessonModel {
  final String id;
  final String courseId;
  final int grade;
  final String mode;
  final String title;
  final String topicKey;
  final String description;
  final String? formulaLatex;
  final String? chapterTitle;
  final String? contentMd;
  final String? coverImage;
  final List<String> gallery;
  final String? videoUrl;
  final String? audioUrl;
  final String? textExplanation;
  final String status;
  final int rewardXP;
  final int rewardCoins;
  final int orderIndex;
  final int sectionCount;
  final bool isCompleted;
  final String? icon;
  final String? accentColor;
  final bool isLocked;

  LessonModel({
    required this.id,
    required this.courseId,
    required this.grade,
    required this.mode,
    required this.title,
    required this.topicKey,
    required this.description,
    this.formulaLatex,
    this.chapterTitle,
    this.contentMd,
    this.coverImage,
    this.gallery = const [],
    this.videoUrl,
    this.audioUrl,
    this.textExplanation,
    this.status = 'PUBLISHED',
    required this.rewardXP,
    required this.rewardCoins,
    required this.orderIndex,
    required this.sectionCount,
    required this.isCompleted,
    this.icon,
    this.accentColor,
    this.isLocked = false,
  });

  factory LessonModel.fromJson(Map<String, dynamic> json) {
    return LessonModel(
      id: json['id'] ?? '',
      courseId: json['courseId'] ?? '',
      grade: json['grade'] ?? 1,
      mode: json['mode'] ?? 'KIDS',
      title: json['title'] ?? '',
      topicKey: json['topicKey'] ?? '',
      description: json['description'] ?? '',
      formulaLatex: json['formulaLatex'],
      chapterTitle: json['chapterTitle'],
      contentMd: json['contentMd'],
      coverImage: json['coverImage'],
      gallery: (json['gallery'] as List<dynamic>?)?.map((e) => e.toString()).toList() ?? [],
      videoUrl: json['videoUrl'],
      audioUrl: json['audioUrl'],
      textExplanation: json['textExplanation'],
      status: json['status'] ?? 'PUBLISHED',
      rewardXP: json['rewardXP'] ?? 50,
      rewardCoins: json['rewardCoins'] ?? 50,
      orderIndex: json['orderIndex'] ?? 0,
      sectionCount: json['sectionCount'] ?? json['questionCount'] ?? 1,
      isCompleted: json['isCompleted'] ?? false,
      icon: json['icon'],
      accentColor: json['accentColor'],
      isLocked: json['isLocked'] ?? false,
    );
  }
}

class QuestionModel {
  final String id;
  final String prompt;
  final String type;
  final List<String> options;
  final String correctAnswer;
  final String explanation;
  final String hint;
  final String? formulaLatex;
  final int orderIndex;
  final bool isAlreadyRewarded;

  QuestionModel({
    required this.id,
    required this.prompt,
    this.type = 'MULTIPLE_CHOICE',
    required this.options,
    this.correctAnswer = '',
    this.explanation = '',
    this.hint = '',
    this.formulaLatex,
    this.orderIndex = 1,
    this.isAlreadyRewarded = false,
  });

  factory QuestionModel.fromJson(Map<String, dynamic> json) {
    return QuestionModel(
      id: json['id'] ?? '',
      prompt: json['prompt'] ?? '',
      type: json['type'] ?? 'MULTIPLE_CHOICE',
      options: List<String>.from(json['options'] ?? []),
      correctAnswer: json['correctAnswer'] ?? '',
      explanation: json['explanation'] ?? '',
      hint: json['hint'] ?? '',
      formulaLatex: json['formulaLatex'],
      orderIndex: json['orderIndex'] ?? 1,
      isAlreadyRewarded: json['isAlreadyRewarded'] ?? false,
    );
  }
}

class SectionModel {
  final String id;
  final String lessonId;
  final String title;
  final int orderIndex;
  final List<QuestionModel> questions;

  SectionModel({
    required this.id,
    required this.lessonId,
    required this.title,
    required this.orderIndex,
    required this.questions,
  });

  factory SectionModel.fromJson(Map<String, dynamic> json) {
    return SectionModel(
      id: json['id'] ?? '',
      lessonId: json['lessonId'] ?? '',
      title: json['title'] ?? '',
      orderIndex: json['orderIndex'] ?? 1,
      questions: (json['questions'] as List<dynamic>?)
              ?.map((q) => QuestionModel.fromJson(q))
              .toList() ??
          [],
    );
  }
}
