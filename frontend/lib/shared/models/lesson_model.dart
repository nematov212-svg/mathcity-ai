class LessonModel {
  final String id;
  final String courseId;
  final String? moduleId;
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

  // Grade 1 & Curriculum additions
  final String? emoji;
  final String? intro;
  final List<String> keyPoints;
  final String? miniExample;
  final int completedSteps;
  final int percent;
  final int xpReward;
  final int coinReward;
  final int estMinutes;
  final List<QuestionModel> questions;

  LessonModel({
    required this.id,
    required this.courseId,
    this.moduleId,
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
    this.emoji,
    this.intro,
    this.keyPoints = const [],
    this.miniExample,
    this.completedSteps = 0,
    this.percent = 0,
    int? xpReward,
    int? coinReward,
    this.estMinutes = 7,
    this.questions = const [],
  })  : xpReward = xpReward ?? rewardXP,
        coinReward = coinReward ?? rewardCoins;

  factory LessonModel.fromJson(Map<String, dynamic> json) {
    final rewardXP = json['rewardXP'] ?? json['xpReward'] ?? 80;
    final rewardCoins = json['rewardCoins'] ?? json['coinReward'] ?? 10;
    final emojiVal = json['emoji'] ?? json['icon'];

    List<QuestionModel> qList = [];
    if (json['questions'] != null && json['questions'] is List) {
      qList = (json['questions'] as List)
          .map((q) => QuestionModel.fromJson(q))
          .toList();
    }

    return LessonModel(
      id: json['id'] ?? '',
      courseId: json['courseId'] ?? '',
      moduleId: json['moduleId'],
      grade: json['grade'] ?? 1,
      mode: json['mode'] ?? 'KIDS',
      title: json['title'] ?? '',
      topicKey: json['topicKey'] ?? '',
      description: json['description'] ?? json['shortDesc'] ?? '',
      formulaLatex: json['formulaLatex'],
      chapterTitle: json['chapterTitle'],
      contentMd: json['contentMd'] ?? json['intro'],
      coverImage: json['coverImage'],
      gallery: (json['gallery'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          [],
      videoUrl: json['videoUrl'],
      audioUrl: json['audioUrl'],
      textExplanation: json['textExplanation'],
      status: json['status'] ?? 'PUBLISHED',
      rewardXP: rewardXP,
      rewardCoins: rewardCoins,
      orderIndex: json['orderIndex'] ?? json['order'] ?? 0,
      sectionCount: json['sectionCount'] ?? json['questionCount'] ?? (qList.isNotEmpty ? qList.length : 1),
      isCompleted: json['isCompleted'] ?? false,
      icon: json['icon'] ?? emojiVal,
      accentColor: json['accentColor'],
      isLocked: json['isLocked'] ?? false,
      emoji: emojiVal,
      intro: json['intro'] ?? json['description'],
      keyPoints: (json['keyPoints'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList() ??
          const [],
      miniExample: json['miniExample'],
      completedSteps: json['completedSteps'] ?? (json['isCompleted'] == true ? 5 : 0),
      percent: json['percent'] ?? (json['isCompleted'] == true ? 100 : 0),
      xpReward: rewardXP,
      coinReward: rewardCoins,
      estMinutes: json['estMinutes'] ?? 7,
      questions: qList,
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
    final opts = List<String>.from(json['options'] ?? []);
    int correctIdx = 0;
    if (json['correctIndex'] is int) {
      correctIdx = json['correctIndex'];
    }
    final correctAns = json['correctAnswer'] ??
        (opts.isNotEmpty && correctIdx >= 0 && correctIdx < opts.length
            ? opts[correctIdx]
            : '');

    return QuestionModel(
      id: json['id'] ?? '',
      prompt: json['prompt'] ?? json['text'] ?? '',
      type: json['type'] ?? 'MULTIPLE_CHOICE',
      options: opts,
      correctAnswer: correctAns,
      explanation: json['explanation'] ?? '',
      hint: json['hint'] ?? '',
      formulaLatex: json['formulaLatex'],
      orderIndex: json['orderIndex'] ?? json['order'] ?? 1,
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
