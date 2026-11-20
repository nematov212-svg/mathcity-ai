import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const _secureStorage = FlutterSecureStorage();
  static const String _keyToken = 'auth_token';
  static const String _keyRefreshToken = 'refresh_token';
  static const String _keyUserMode = 'user_mode';
  static const String _keyUserAge = 'user_age';
  static const String _keyUserName = 'user_name';

  static Future<void> saveAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken, token);
    try {
      await _secureStorage.write(key: _keyToken, value: token);
    } catch (_) {}
  }

  static Future<String?> getAuthToken() async {
    try {
      final secureVal = await _secureStorage.read(key: _keyToken);
      if (secureVal != null && secureVal.isNotEmpty) return secureVal;
    } catch (_) {}
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyToken);
  }

  static Future<void> clearAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
    await prefs.remove(_keyRefreshToken);
    try {
      await _secureStorage.delete(key: _keyToken);
      await _secureStorage.delete(key: _keyRefreshToken);
    } catch (_) {}
  }

  static Future<void> saveRefreshToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyRefreshToken, token);
    try {
      await _secureStorage.write(key: _keyRefreshToken, value: token);
    } catch (_) {}
  }

  static Future<String?> getRefreshToken() async {
    try {
      final secureVal = await _secureStorage.read(key: _keyRefreshToken);
      if (secureVal != null && secureVal.isNotEmpty) return secureVal;
    } catch (_) {}
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyRefreshToken);
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
    try {
      await _secureStorage.deleteAll();
    } catch (_) {}
  }
}
