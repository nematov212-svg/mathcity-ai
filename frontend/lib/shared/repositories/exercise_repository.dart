import 'dart:convert';
import 'dart:math' as math;
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart' show rootBundle;
import '../../core/network/api_client.dart';
import '../models/exercise_model.dart';

class ExerciseRepository {
  static final ExerciseRepository _instance = ExerciseRepository._internal();
  factory ExerciseRepository() => _instance;
  ExerciseRepository._internal();

  List<Exercise>? _cachedAllExercises;

  /// Determines appropriate educational difficulty level based on age:
  /// - 6–8 yosh: Level 1 (boshlang‘ich)
  /// - 9–12 yosh: Level 2 (o‘rta)
  /// - 13–16 yosh: Level 3 (yuqori)
  static int determineLevelForAge(int age) {
    if (age <= 8) return 1;
    if (age <= 12) return 2;
    return 3;
  }

  /// Loads 20 unique random exercises filtered by level.
  /// Attempts backend /api/exercises first; falls back seamlessly to local assets/data/exercises_1000.json.
  Future<List<Exercise>> getSessionExercises({
    int? level,
    int? age,
    int count = 20,
  }) async {
    final targetLevel = level ?? (age != null ? determineLevelForAge(age) : 2);

    // 1. Attempt backend fetch
    try {
      final res = await ApiClient().dio.get(
        '/exercises',
        queryParameters: {
          'level': targetLevel,
          'count': count,
        },
      ).timeout(const Duration(seconds: 4));

      if (res.data != null) {
        List<dynamic>? rawList;
        if (res.data['data'] is List) {
          rawList = res.data['data'] as List<dynamic>;
        } else if (res.data is List) {
          rawList = res.data as List<dynamic>;
        }

        if (rawList != null && rawList.isNotEmpty) {
          final serverExercises = <Exercise>[];
          for (final raw in rawList) {
            try {
              final ex = Exercise.fromJson(raw as Map<String, dynamic>);
              if (ex.isValid()) {
                serverExercises.add(ex);
              } else {
                debugPrint('⚠️ [ExerciseRepository] Noto‘g‘ri server savoli o‘tkazib yuborildi: ${ex.id}');
              }
            } catch (err) {
              debugPrint('⚠️ [ExerciseRepository] Savolni parse qilishda xato: $err');
            }
          }

          if (serverExercises.length >= count) {
            return serverExercises.sublist(0, count);
          } else if (serverExercises.isNotEmpty) {
            return serverExercises;
          }
        }
      }
    } catch (e) {
      debugPrint('ℹ️ [ExerciseRepository] Serverdan mashqlarni yuklash kechikmoqda yoki oflayn, mahalliy bazadan yuklanadi: $e');
    }

    // 2. Offline Fallback: Load from assets/data/exercises_1000.json
    return _loadFromLocalAsset(targetLevel: targetLevel, count: count);
  }

  /// Loads, parses and validates exercises from bundled JSON
  Future<List<Exercise>> _loadFromLocalAsset({
    required int targetLevel,
    required int count,
  }) async {
    if (_cachedAllExercises == null) {
      try {
        final jsonString = await rootBundle.loadString('assets/data/exercises_1000.json');
        final rawList = jsonDecode(jsonString) as List<dynamic>;
        final validList = <Exercise>[];

        for (int i = 0; i < rawList.length; i++) {
          try {
            final ex = Exercise.fromJson(rawList[i] as Map<String, dynamic>);
            if (ex.isValid()) {
              validList.add(ex);
            } else {
              debugPrint('⚠️ [ExerciseRepository] Buzilgan misol o‘tkazib yuborildi (index: $i, id: ${ex.id})');
            }
          } catch (e) {
            debugPrint('⚠️ [ExerciseRepository] Misolni o‘qishda xatolik (index: $i): $e');
          }
        }
        _cachedAllExercises = validList;
      } catch (e) {
        debugPrint('🚨 [ExerciseRepository] exercises_1000.json yuklashda xatolik: $e');
        _cachedAllExercises = [];
      }
    }

    final all = _cachedAllExercises ?? [];
    if (all.isEmpty) return [];

    // Filter by requested level
    List<Exercise> matching = all.where((e) => e.level == targetLevel).toList();

    // If matching exercises are fewer than requested count, supplement from adjacent levels
    if (matching.length < count) {
      final otherLevels = all.where((e) => e.level != targetLevel).toList()..shuffle();
      matching.addAll(otherLevels.take(count - matching.length));
    }

    // Select non-repeating random items
    matching.shuffle(math.Random());
    return matching.take(count).toList();
  }

  /// For unit tests and direct validation
  Future<List<Exercise>> loadAllLocalExercises() async {
    final jsonString = await rootBundle.loadString('assets/data/exercises_1000.json');
    final rawList = jsonDecode(jsonString) as List<dynamic>;
    return rawList.map((e) => Exercise.fromJson(e as Map<String, dynamic>)).toList();
  }
}
