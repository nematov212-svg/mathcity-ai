import 'dart:convert';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const _secureStorage = FlutterSecureStorage();
  static const String _keyToken = 'auth_token';
  static const String _keyRefreshToken = 'refresh_token';
  static const String _keyUserMode = 'user_mode';
  static const String _keyUserAge = 'user_age';
  static const String _keyUserName = 'user_name';
  static const String _keyCachedStudent = 'cached_student_profile_v2';
  static const String _keySyncQueue = 'pending_offline_sync_queue';

  static bool get _isTestEnv =>
      !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');

  static Future<void> saveAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken, token);
    if (!_isTestEnv) {
      try {
        await _secureStorage.write(key: _keyToken, value: token);
      } catch (_) {}
    }
  }

  static Future<String?> getAuthToken() async {
    if (!_isTestEnv) {
      try {
        final secureVal = await _secureStorage.read(key: _keyToken);
        if (secureVal != null && secureVal.trim().isNotEmpty) {
          return secureVal.trim();
        }
      } catch (_) {}
    }
    final prefs = await SharedPreferences.getInstance();
    final prefVal = prefs.getString(_keyToken);
    if (prefVal != null && prefVal.trim().isNotEmpty) {
      if (!_isTestEnv) {
        try {
          await _secureStorage.write(key: _keyToken, value: prefVal.trim());
        } catch (_) {}
      }
      return prefVal.trim();
    }
    return null;
  }

  static Future<bool> hasAuthToken() async {
    final token = await getAuthToken();
    return token != null && token.isNotEmpty;
  }

  static Future<void> clearAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyRefreshToken);
    if (!_isTestEnv) {
      try {
        await _secureStorage.delete(key: _keyToken);
        await _secureStorage.delete(key: _keyRefreshToken);
      } catch (_) {}
    }
  }

  static Future<void> saveRefreshToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyRefreshToken, token);
    if (!_isTestEnv) {
      try {
        await _secureStorage.write(key: _keyRefreshToken, value: token);
      } catch (_) {}
    }
  }

  static Future<String?> getRefreshToken() async {
    if (!_isTestEnv) {
      try {
        final secureVal = await _secureStorage.read(key: _keyRefreshToken);
        if (secureVal != null && secureVal.trim().isNotEmpty) {
          return secureVal.trim();
        }
      } catch (_) {}
    }
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyRefreshToken);
  }

  /// Bulletproof offline-first StudentModel snapshot persistence
  static Future<void> saveCachedStudent(
      Map<String, dynamic> studentJson) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final encoded = jsonEncode(studentJson);
      await prefs.setString(_keyCachedStudent, encoded);
    } catch (_) {}
  }

  static Future<Map<String, dynamic>?> getCachedStudent() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final raw = prefs.getString(_keyCachedStudent);
      if (raw != null && raw.isNotEmpty) {
        return jsonDecode(raw) as Map<String, dynamic>;
      }
    } catch (_) {}
    return null;
  }

  static Future<void> clearCachedStudent() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_keyCachedStudent);
    } catch (_) {}
  }

  /// Offline Mutation Sync Queue
  static Future<void> addToSyncQueue(Map<String, dynamic> action) async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(_keySyncQueue) ?? [];
      list.add(jsonEncode(action));
      await prefs.setStringList(_keySyncQueue, list);
    } catch (_) {}
  }

  static Future<List<Map<String, dynamic>>> getSyncQueue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final list = prefs.getStringList(_keySyncQueue);
      if (list == null || list.isEmpty) return [];
      return list
          .map((e) {
            try {
              return jsonDecode(e) as Map<String, dynamic>;
            } catch (_) {
              return <String, dynamic>{};
            }
          })
          .where((m) => m.isNotEmpty)
          .toList();
    } catch (_) {
      return [];
    }
  }

  static Future<void> clearSyncQueue() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.remove(_keySyncQueue);
    } catch (_) {}
  }

  static Future<void> saveUserData({
    required String mode,
    required int age,
    required String name,
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyUserMode, mode);
    await prefs.setInt(_keyUserAge, age);
    await prefs.setString(_keyUserName, name);
  }

  static Future<Map<String, dynamic>> getUserData() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'mode': prefs.getString(_keyUserMode) ?? 'KIDS',
      'age': prefs.getInt(_keyUserAge) ?? 10,
      'name': prefs.getString(_keyUserName) ?? 'O‘quvchi',
    };
  }

  static Future<void> clear() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    if (!_isTestEnv) {
      try {
        await _secureStorage.deleteAll();
      } catch (_) {}
    }
  }
}
