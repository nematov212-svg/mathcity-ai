import 'package:shared_preferences/shared_preferences.dart';

class StorageService {
  static const String _keyToken = 'auth_token';
  static const String _keyUserMode = 'user_mode';
  static const String _keyUserAge = 'user_age';
  static const String _keyUserName = 'user_name';

  static Future<void> saveAuthToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_keyToken, token);
  }

  static Future<String?> getAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_keyToken);
  }

  static Future<void> clearAuthToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_keyToken);
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
  }
}
