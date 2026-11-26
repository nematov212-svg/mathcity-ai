import 'dart:convert';
import 'dart:io' show Platform;
import 'dart:math' as math;
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

  static Source? _correctSource;
  static Source? _wrongSource;
  static Source? _streakSource;
  static Source? _coinSource;

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

  /// Synthesizes valid 16-bit PCM WAV in memory (zero network requests, zero CORS, zero 403 Forbidden)
  static Source _generateToneSource({
    required List<double> freqs,
    required double durationSec,
    double volume = 0.25,
  }) {
    const sampleRate = 22050;
    final totalSamples = (sampleRate * durationSec).toInt();
    final byteData = ByteData(44 + totalSamples * 2);

    // RIFF Header
    byteData.setUint8(0, 0x52); // R
    byteData.setUint8(1, 0x49); // I
    byteData.setUint8(2, 0x46); // F
    byteData.setUint8(3, 0x46); // F
    byteData.setUint32(4, 36 + totalSamples * 2, Endian.little);
    byteData.setUint8(8, 0x57); // W
    byteData.setUint8(9, 0x41); // A
    byteData.setUint8(10, 0x56); // V
    byteData.setUint8(11, 0x45); // E

    // fmt subchunk
    byteData.setUint8(12, 0x66); // f
    byteData.setUint8(13, 0x6D); // m
    byteData.setUint8(14, 0x74); // t
    byteData.setUint8(15, 0x20); // ' '
    byteData.setUint32(16, 16, Endian.little); // Subchunk1Size
    byteData.setUint16(20, 1, Endian.little); // AudioFormat (1 = PCM)
    byteData.setUint16(22, 1, Endian.little); // NumChannels (1 = Mono)
    byteData.setUint32(24, sampleRate, Endian.little); // SampleRate
    byteData.setUint32(28, sampleRate * 2, Endian.little); // ByteRate
    byteData.setUint16(32, 2, Endian.little); // BlockAlign
    byteData.setUint16(34, 16, Endian.little); // BitsPerSample

    // data subchunk
    byteData.setUint8(36, 0x64); // d
    byteData.setUint8(37, 0x61); // a
    byteData.setUint8(38, 0x74); // t
    byteData.setUint8(39, 0x61); // a
    byteData.setUint32(40, totalSamples * 2, Endian.little);

    final samplesPerSegment = totalSamples ~/ freqs.length;
    int offset = 44;
    for (int i = 0; i < totalSamples; i++) {
      final seg = math.min(i ~/ samplesPerSegment, freqs.length - 1);
      final freq = freqs[seg];
      final t = i / sampleRate;
      final decay = 1.0 - (i / totalSamples);
      final sample =
          (math.sin(2 * math.pi * freq * t) * volume * decay * 32767).toInt();
      byteData.setInt16(offset, sample.clamp(-32768, 32767), Endian.little);
      offset += 2;
    }

    final base64Audio = base64Encode(byteData.buffer.asUint8List());
    return UrlSource('data:audio/wav;base64,$base64Audio');
  }

  // --- 1. Correct Answer Sound (C5 -> E5 -> G5 Chime) ---
  Future<void> playCorrect() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.mediumImpact();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      _correctSource ??= _generateToneSource(
        freqs: [523.25, 659.25, 783.99],
        durationSec: 0.28,
        volume: 0.3,
      );
      await _player?.play(_correctSource!);
    } catch (_) {}
  }

  // --- 2. Incorrect / Wrong Answer Sound (Low Tone) ---
  Future<void> playWrong() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.heavyImpact();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      _wrongSource ??= _generateToneSource(
        freqs: [220.0, 180.0],
        durationSec: 0.25,
        volume: 0.25,
      );
      await _player?.play(_wrongSource!);
    } catch (_) {}
  }

  // --- 3. Streak / Fanfare Sound (Ascending Melody) ---
  Future<void> playStreak() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.selectionClick();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      _streakSource ??= _generateToneSource(
        freqs: [440.0, 554.37, 659.25, 880.0],
        durationSec: 0.35,
        volume: 0.3,
      );
      await _player?.play(_streakSource!);
    } catch (_) {}
  }

  // --- 4. Coin Drop / Collect Sound (High Ping) ---
  Future<void> playCoin() async {
    if (!_isSoundEnabled) return;
    try {
      HapticFeedback.lightImpact();
      if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) return;
      _player ??= AudioPlayer();
      _coinSource ??= _generateToneSource(
        freqs: [987.77, 1318.51],
        durationSec: 0.16,
        volume: 0.25,
      );
      await _player?.play(_coinSource!);
    } catch (_) {}
  }

  void dispose() {
    _player?.dispose();
    _player = null;
  }
}
