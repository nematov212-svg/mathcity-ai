class Exercise {
  final int id;
  final int level;
  final String topic;
  final String question;
  final String hint;
  final List<String> options;
  final int correctIndex;
  final String answer;
  final String explanation;

  const Exercise({
    required this.id,
    required this.level,
    required this.topic,
    required this.question,
    required this.hint,
    required this.options,
    required this.correctIndex,
    required this.answer,
    required this.explanation,
  });

  factory Exercise.fromJson(Map<String, dynamic> json) {
    final opts = (json['options'] as List<dynamic>?)
            ?.map((e) => e.toString().trim())
            .toList() ??
        <String>[];

    final cIdx = json['correctIndex'] is int
        ? json['correctIndex'] as int
        : int.tryParse(json['correctIndex']?.toString() ?? '0') ?? 0;

    return Exercise(
      id: json['id'] is int
          ? json['id'] as int
          : int.tryParse(json['id']?.toString() ?? '0') ?? 0,
      level: json['level'] is int
          ? json['level'] as int
          : int.tryParse(json['level']?.toString() ?? '1') ?? 1,
      topic: json['topic']?.toString().trim() ?? 'Umumiy',
      question: json['question']?.toString().trim() ?? '',
      hint: json['hint']?.toString().trim() ?? '',
      options: opts,
      correctIndex: cIdx,
      answer: json['answer']?.toString().trim() ?? '',
      explanation: json['explanation']?.toString().trim() ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'level': level,
        'topic': topic,
        'question': question,
        'hint': hint,
        'options': options,
        'correctIndex': correctIndex,
        'answer': answer,
        'explanation': explanation,
      };

  /// Strict validation rule:
  /// 1. Exactly 4 options
  /// 2. 0 <= correctIndex < 4
  /// 3. options[correctIndex] == answer
  /// 4. Question must not be empty
  bool isValid() {
    if (question.isEmpty) return false;
    if (options.length != 4) return false;
    if (correctIndex < 0 || correctIndex >= options.length) return false;
    if (options[correctIndex] != answer) return false;
    return true;
  }
}
