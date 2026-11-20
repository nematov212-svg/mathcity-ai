import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/services.dart';
import 'package:audioplayers/audioplayers.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SoundService {
  static final SoundService _instance = SoundService._internal();
  factory SoundService() => _instance;
  SoundService._internal();

  AudioPlayer? _player;
  bool _isSoundEnabled = true;
  bool _initialized = false;

  bool get isSoundEnabled => _isSoundEnabled;

  Future<void> init() async {
    if (_initialized) return;
    try {
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
        _initialized = true;
        return;
      }
      final prefs = await SharedPreferences.getInstance();
      _isSoundEnabled = prefs.getBool('sound_effects_enabled') ?? true;
      _player = AudioPlayer();
      _initialized = true;
    } catch (_) {
      _initialized = true;
    }
  }

  Future<void> setSoundEnabled(bool enabled) async {
    _isSoundEnabled = enabled;
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool('sound_effects_enabled', enabled);
    } catch (_) {}
  }

  Future<void> toggleSound() async {
    await setSoundEnabled(!_isSoundEnabled);
  }

  // --- 1. Correct Answer Sound ---
  Future<void> playCorrect() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.mediumImpact();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      // Reliable public sound byte for educational chime
      await _player?.play(UrlSource('https://cdn.freesound.org/previews/320/320655_5260872-lq.mp3'));
    } catch (_) {}
  }

  // --- 2. Incorrect / Wrong Answer Sound ---
  Future<void> playWrong() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.heavyImpact();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      await _player?.play(UrlSource('https://cdn.freesound.org/previews/415/415079_5121236-lq.mp3'));
    } catch (_) {}
  }

  // --- 3. Streak / Flame Sound ---
  Future<void> playStreak() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.selectionClick();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      await _player?.play(UrlSource('https://cdn.freesound.org/previews/274/274178_5121236-lq.mp3'));
    } catch (_) {}
  }

  // --- 4. Coin Drop / Collect Sound ---
  Future<void> playCoin() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.lightImpact();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      await _player?.play(UrlSource('https://cdn.freesound.org/previews/341/341695_5858296-lq.mp3'));
    } catch (_) {}
  }

  void dispose() {
    _player?.dispose();
    _player = null;
  }
}
