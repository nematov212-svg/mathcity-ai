import 'dart:async';
import 'dart:convert';
import 'dart:io' show File;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import 'package:file_picker/file_picker.dart';
import 'package:image_picker/image_picker.dart';
import 'package:record/record.dart';
import 'package:uuid/uuid.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import 'package:flutter_tts/flutter_tts.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/responsive_layout.dart';
import '../../core/theme/app_theme.dart';
import '../../shared/providers/student_provider.dart';
import '../../shared/repositories/exercise_repository.dart';

class SolutionStep {
  final int stepNumber;
  final String title;
  final String explanation;
  final String latex;

  SolutionStep({
    required this.stepNumber,
    required this.title,
    required this.explanation,
    required this.latex,
  });

  factory SolutionStep.fromJson(Map<String, dynamic> json) {
    return SolutionStep(
      stepNumber: json['stepNumber'] ?? 1,
      title: json['title'] ?? '',
      explanation: json['explanation'] ?? '',
      latex: json['latex'] ?? '',
    );
  }
}

class MessageItem {
  final String id;
  final String text;
  final bool isUser;
  final String? formulaLatex;
  final List<SolutionStep>? steps;
  final String? finalAnswer;
  final List<String>? suggestedActions;
  final String inputType; // 'TEXT', 'IMAGE', 'VOICE'
  final Uint8List? imagePreviewBytes;
  final DateTime timestamp;

  MessageItem({
    String? id,
    required this.text,
    required this.isUser,
    this.formulaLatex,
    this.steps,
    this.finalAnswer,
    this.suggestedActions,
    this.inputType = 'TEXT',
    this.imagePreviewBytes,
    DateTime? timestamp,
  })  : id = id ?? const Uuid().v4(),
        timestamp = timestamp ?? DateTime.now();
}

class ConversationSummary {
  final String id;
  final String title;
  final String preview;
  final int messageCount;
  final String updatedAt;

  ConversationSummary({
    required this.id,
    required this.title,
    required this.preview,
    required this.messageCount,
    required this.updatedAt,
  });

  factory ConversationSummary.fromJson(Map<String, dynamic> json) {
    return ConversationSummary(
      id: json['id'] ?? '',
      title: json['title'] ?? 'Yangi suhbat',
      preview: json['preview'] ?? '',
      messageCount: json['messageCount'] ?? 0,
      updatedAt: json['updatedAt'] ?? '',
    );
  }
}

class ZiyoTutorScreen extends ConsumerStatefulWidget {
  const ZiyoTutorScreen({super.key});

  @override
  ConsumerState<ZiyoTutorScreen> createState() => _ZiyoTutorScreenState();
}

class _ZiyoTutorScreenState extends ConsumerState<ZiyoTutorScreen> {
  final _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  final ImagePicker _picker = ImagePicker();
  AudioRecorder? _audioRecorder;

  final stt.SpeechToText _speech = stt.SpeechToText();
  final FlutterTts _flutterTts = FlutterTts();
  bool _speechAvailable = false;
  String _speechLocale = 'uz_UZ';
  String _liveTranscript = '';
  bool _isSpeaking = false;

  bool _isLoading = false;
  bool _isSending = false;
  DateTime? _lastSendTime;
  final Set<String> _sentMessageIds = {};
  int _currentStep = 1;

  // Quota status
  int _remainingQuota = 5;
  bool _isPro = false;

  // Active conversation state
  String? _activeConversationId;
  List<ConversationSummary> _conversations = [];
  bool _showDesktopSidebar = true;

  // Selected image preview
  Uint8List? _selectedImageBytes;

  // Voice recording state
  bool _isRecording = false;
  int _recordingSeconds = 0;
  Timer? _recordingTimer;

  final List<MessageItem> _messages = [];

  final List<String> _starterPrompts = [
    '2 × 5 nechchi bo‘ladi?',
    'Kasrlarni qanday qo‘shamiz?',
    'Foizlarni tushuntirib ber.',
    'Tenglamalarni yechishni o‘rgat.',
  ];

  @override
  void initState() {
    super.initState();
    _fetchQuotaStatus();
    _fetchConversations();
    _initSpeech();
    _initTts();
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    _recordingTimer?.cancel();
    try {
      _speech.stop();
      _speech.cancel();
    } catch (_) {}
    try {
      _flutterTts.stop();
    } catch (_) {}
    _disposeRecorder();
    super.dispose();
  }

  Future<void> _initSpeech() async {
    try {
      _speechAvailable = await _speech.initialize(
        onError: (val) => debugPrint('ℹ️ [Speech] Error: $val'),
        onStatus: (val) => debugPrint('ℹ️ [Speech] Status: $val'),
      );
      if (_speechAvailable) {
        final locales = await _speech.locales();
        final uzLocale = locales.where((l) => l.localeId.startsWith('uz')).firstOrNull;
        final ruLocale = locales.where((l) => l.localeId.startsWith('ru')).firstOrNull;
        final enLocale = locales.where((l) => l.localeId.startsWith('en')).firstOrNull;
        _speechLocale = uzLocale?.localeId ?? ruLocale?.localeId ?? enLocale?.localeId ?? 'uz_UZ';
      }
    } catch (e) {
      debugPrint('ℹ️ [Speech] Init exception: $e');
      _speechAvailable = false;
    }
  }

  Future<void> _initTts() async {
    try {
      await _flutterTts.setLanguage('uz-UZ');
      await _flutterTts.setPitch(1.0);
      await _flutterTts.setSpeechRate(0.9);
      _flutterTts.setCompletionHandler(() {
        if (mounted) setState(() => _isSpeaking = false);
      });
      _flutterTts.setErrorHandler((_) {
        if (mounted) setState(() => _isSpeaking = false);
      });
    } catch (e) {
      debugPrint('ℹ️ [TTS] Init exception: $e');
    }
  }

  Future<void> _speakText(String text) async {
    try {
      if (_isSpeaking) {
        await _flutterTts.stop();
        if (mounted) setState(() => _isSpeaking = false);
        return;
      }
      final cleanText = text
          .replaceAll(RegExp(r'\*\*|\*|#|`|_'), '')
          .replaceAll(RegExp(r'\\[a-zA-Z]+'), '')
          .trim();
      if (cleanText.isEmpty) return;
      setState(() => _isSpeaking = true);
      await _flutterTts.speak(cleanText);
    } catch (e) {
      debugPrint('ℹ️ [TTS] Speak exception: $e');
      if (mounted) setState(() => _isSpeaking = false);
    }
  }

  AudioRecorder _getOrCreateRecorder() {
    _audioRecorder ??= AudioRecorder();
    return _audioRecorder!;
  }

  void _disposeRecorder() {
    try {
      _audioRecorder?.dispose();
    } catch (_) {}
    _audioRecorder = null;
  }

  void _fetchQuotaStatus() async {
    try {
      final res = await ApiClient().dio.get('/ai/quota');
      if (!mounted) return;
      if (res.data['success'] == true) {
        final data = res.data['data'];
        setState(() {
          _isPro = data['isPro'] == true;
          _remainingQuota = data['remaining'] ?? 5;
        });
      }
    } catch (e) {
      debugPrint('ℹ️ [ZiyoTutor] Quota status xatosi: $e');
      if (!mounted) return;
      final student = ref.read(studentProvider).student;
      final isProUser = student?.subscription.status == 'PRO_ACTIVE';
      setState(() {
        _isPro = isProUser;
      });
    }
  }

  void _fetchConversations() async {
    try {
      final res = await ApiClient().dio.get('/ai/conversations');
      if (!mounted) return;
      if (res.data['success'] == true && res.data['data'] is List) {
        final list = (res.data['data'] as List)
            .map((e) => ConversationSummary.fromJson(e))
            .toList();
        setState(() {
          _conversations = list;
        });
      }
    } catch (e) {
      debugPrint('ℹ️ [ZiyoTutor] Suhbatlarni yuklash xatosi: $e');
    }
  }

  void _loadConversation(String convId) async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiClient().dio.get('/ai/conversations/$convId');
      if (!mounted) return;
      if (res.data['success'] == true && res.data['data'] != null) {
        final msgs = res.data['data']['messages'] as List<dynamic>? ?? [];
        setState(() {
          _activeConversationId = convId;
          _messages.clear();
          for (final m in msgs) {
            _messages.add(MessageItem(
              text: m['text'] ?? '',
              isUser: m['role'] == 'user',
              formulaLatex: m['formulaLatex'],
              finalAnswer: m['finalAnswer'],
              inputType: m['inputType'] ?? 'TEXT',
            ));
          }
          _isLoading = false;
        });
        _scrollToBottom();
      }
    } catch (e) {
      debugPrint('ℹ️ [ZiyoTutor] Suhbatni yuklash xatosi: $e');
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _startNewConversation() {
    setState(() {
      _activeConversationId = null;
      _messages.clear();
      _selectedImageBytes = null;
    });
  }

  void _deleteConversation(String convId) async {
    try {
      await ApiClient().dio.delete('/ai/conversations/$convId');
      if (_activeConversationId == convId) {
        _startNewConversation();
      }
      _fetchConversations();
    } catch (_) {}
  }

  void _pickGalleryImage() async {
    try {
      final result = await FilePicker.pickFiles(
        type: FileType.image,
        withData: true,
      );
      if (!mounted) return;
      if (result == null || result.files.isEmpty) {
        return;
      }
      final bytes = result.files.first.bytes;
      if (bytes != null) {
        setState(() {
          _selectedImageBytes = bytes;
        });
        return;
      }
      // Native fallback (iOS / Android only)
      if (!kIsWeb) {
        final XFile? image = await _picker.pickImage(
          source: ImageSource.gallery,
          maxWidth: 1280,
          maxHeight: 1280,
          imageQuality: 85,
        );
        if (!mounted) return;
        if (image != null) {
          final fileBytes = await image.readAsBytes();
          if (!mounted) return;
          setState(() {
            _selectedImageBytes = fileBytes;
          });
        }
      }
    } catch (e) {
      debugPrint('⚠️ Rasm tanlashda ogohlantirish: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Rasm tanlashda xatolik yuz berdi. Boshqa fayl tanlab ko‘ring.'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  void _clearSelectedImage() {
    setState(() {
      _selectedImageBytes = null;
    });
  }

  void _toggleRecording() async {
    if (_isRecording) {
      _finishVoiceRecording();
    } else {
      _startVoiceRecording();
    }
  }

  Future<void> _startVoiceRecording() async {
    if (_isSending || _isLoading) return;

    // Reset independent session state
    _liveTranscript = '';
    _recordingSeconds = 0;

    try {
      final recorder = _getOrCreateRecorder();
      final hasPermission = await recorder.hasPermission();
      if (!mounted) return;
      if (!hasPermission) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Mikrofon ruxsati berilmadi. Iltimos, sozlamalarda mikrofonga ruxsat bering.'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
        _disposeRecorder();
        return;
      }

      final config = kIsWeb
          ? const RecordConfig(encoder: AudioEncoder.opus)
          : const RecordConfig(encoder: AudioEncoder.aacLc);

      await recorder.start(config, path: '');

      // Start SpeechToText for live transcription
      if (_speechAvailable) {
        try {
          await _speech.listen(
            onResult: (result) {
              if (mounted) {
                setState(() {
                  _liveTranscript = result.recognizedWords;
                });
              }
            },
            localeId: _speechLocale,
            pauseFor: const Duration(seconds: 3),
            listenOptions: stt.SpeechListenOptions(
              partialResults: true,
              cancelOnError: false,
            ),
          );
        } catch (e) {
          debugPrint('ℹ️ [Speech] Listen ogohlantirish: $e');
        }
      }

      setState(() {
        _isRecording = true;
      });

      _recordingTimer?.cancel();
      _recordingTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
        if (!mounted) {
          timer.cancel();
          return;
        }
        setState(() => _recordingSeconds++);
      });
    } catch (e) {
      debugPrint('⚠️ Ovoz yozish xatosi: $e');
      setState(() {
        _isRecording = false;
        _recordingSeconds = 0;
      });
      _disposeRecorder();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Ovoz yozishda xatolik yuz berdi. Mikrofon ulanganligini tekshiring.'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  Future<void> _finishVoiceRecording() async {
    if (!_isRecording) return;

    _recordingTimer?.cancel();

    // Guard against double submission
    if (_isSending) return;
    _isSending = true;

    String? path;
    try {
      if (_speechAvailable) {
        await _speech.stop();
      }
    } catch (_) {}

    try {
      final recorder = _audioRecorder;
      path = await recorder?.stop();
    } catch (e) {
      debugPrint('⚠️ Recorder stop xatosi: $e');
    }

    final transcriptToSend = _liveTranscript.trim();

    // Reset independent session state
    _liveTranscript = '';
    _textController.clear();
    try {
      await _speech.cancel();
    } catch (_) {}
    _disposeRecorder();

    setState(() {
      _isRecording = false;
      _recordingSeconds = 0;
    });

    _sendVoiceMessage(path: path ?? '', transcript: transcriptToSend);
  }

  void _cancelRecording() async {
    _recordingTimer?.cancel();
    try {
      if (_speechAvailable) {
        await _speech.stop();
        await _speech.cancel();
      }
    } catch (_) {}
    try {
      await _audioRecorder?.stop();
    } catch (_) {}
    _disposeRecorder();
    setState(() {
      _isRecording = false;
      _recordingSeconds = 0;
      _liveTranscript = '';
    });
  }

  void _sendVoiceMessage({
    required String path,
    required String transcript,
    int retryCount = 0,
  }) async {
    final messageId = const Uuid().v4();
    if (_sentMessageIds.contains(messageId)) return;
    _sentMessageIds.add(messageId);

    Uint8List? audioBytes;
    try {
      if (path.isNotEmpty && !kIsWeb) {
        final file = File(path);
        if (await file.exists()) {
          audioBytes = await file.readAsBytes();
        }
      }
    } catch (e) {
      debugPrint('ℹ️ [ZiyoTutor] Audio faylni o‘qish: $e');
    }

    final questionText = transcript.isNotEmpty
        ? transcript
        : (path.isNotEmpty ? 'Ovozli masala' : '');

    final userMessageIndex = _messages.length;
    final displayUserText = transcript.isNotEmpty
        ? '🎙️ "$transcript"'
        : '🎙️ [Ovoz yozildi, tahlil qilinmoqda...]';

    setState(() {
      _messages.add(MessageItem(
        id: messageId,
        text: displayUserText,
        isUser: true,
        inputType: 'VOICE',
      ));
      _isLoading = true;
    });
    _scrollToBottom();

    // Cap recent history at 4 messages
    final recentHistory = _messages.reversed.take(4).toList().reversed.map((m) => {
      'role': m.isUser ? 'user' : 'model',
      'text': m.text,
    }).toList();

    try {
      final res = await ApiClient().dio.post('/ai/chat/voice', data: {
        'messageId': messageId,
        'current_question': questionText.isNotEmpty ? questionText : null,
        'transcribedText': questionText.isNotEmpty ? questionText : null,
        'message': questionText.isNotEmpty ? questionText : null,
        if (audioBytes != null) 'audioBase64': base64Encode(audioBytes),
        'mimeType': kIsWeb ? 'audio/webm' : 'audio/m4a',
        'conversationId': _activeConversationId,
        'history': recentHistory,
      });

      if (!mounted) return;

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final convId = data['conversationId'];
        if (convId != null) _activeConversationId = convId;

        final reply = data['reply'] as String? ?? 'Savolingiz tahlil qilindi.';
        final solution = data['solution'];
        final serverTranscript = data['transcript'] as String?;

        setState(() {
          if (serverTranscript != null && serverTranscript.isNotEmpty && userMessageIndex < _messages.length) {
            _messages[userMessageIndex] = MessageItem(
              id: messageId,
              text: '🎙️ "$serverTranscript"',
              isUser: true,
              inputType: 'VOICE',
            );
          }
          _messages.add(MessageItem(
            text: reply,
            isUser: false,
            formulaLatex: solution != null ? solution['formulaLatex'] : null,
            finalAnswer: solution != null ? solution['finalAnswer'] : null,
            inputType: 'VOICE',
          ));
        });
        _fetchConversations();
        _fetchQuotaStatus();

        // Voice reply speech
        _speakText(reply);
      }
    } catch (e) {
      if (!mounted) return;
      _handleVoiceError(
        e,
        path: path,
        transcript: transcript,
        retryCount: retryCount,
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isSending = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _handleVoiceError(
    dynamic e, {
    required String path,
    required String transcript,
    required int retryCount,
  }) {
    if (e is DioException && e.response?.statusCode == 429) {
      final responseData = e.response?.data;
      final isQuotaLimit = responseData is Map &&
          (responseData['code'] == 'AI_QUOTA_EXCEEDED' ||
           responseData['error']?.toString().contains('bepul') == true);

      if (isQuotaLimit) {
        _showQuotaExceededDialog();
        setState(() {
          _messages.add(MessageItem(
            text:
                'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.\nCheksiz savollar berish uchun MathCity Pro ga obuna bo‘ling!',
            isUser: false,
            suggestedActions: ['Pro tarifiga o‘tish (Cheksiz savollar)'],
          ));
        });
        return;
      }

      // Upstream 429: exponential backoff up to 2 retries (1.5s, 3s)
      if (retryCount < 2) {
        final backoffMs = retryCount == 0 ? 1500 : 3000;
        Future.delayed(Duration(milliseconds: backoffMs), () {
          if (mounted) {
            _sendVoiceMessage(path: path, transcript: transcript, retryCount: retryCount + 1);
          }
        });
      } else {
        setState(() {
          _messages.add(MessageItem(
            text: 'Ustoz biroz band, 10 soniyadan keyin urinib ko‘ring.',
            isUser: false,
          ));
        });
      }
    } else {
      debugPrint('🚨 [ZiyoTutor] Ovozli xabar xatosi: $e');
      setState(() {
        _messages.add(MessageItem(
          text: 'Ovozli xabarni tahlil qilishda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.',
          isUser: false,
        ));
      });
    }
  }

  void _sendMessage({
    String? customText,
    String action = 'chat',
    int retryCount = 0,
  }) async {
    if (_isSending || _isLoading) return;

    final now = DateTime.now();
    if (_lastSendTime != null && now.difference(_lastSendTime!) < const Duration(milliseconds: 1500)) {
      return;
    }
    _lastSendTime = now;

    final text = customText ?? _textController.text.trim();
    final hasImage = _selectedImageBytes != null;

    if (text.isEmpty && !hasImage) return;

    final messageId = const Uuid().v4();
    if (_sentMessageIds.contains(messageId)) return;
    _sentMessageIds.add(messageId);

    final imageBytesToSend = _selectedImageBytes;

    if (customText == null) {
      _textController.clear();
      _clearSelectedImage();
    }

    _isSending = true;
    setState(() {
      _messages.add(MessageItem(
        id: messageId,
        text: text.isNotEmpty ? text : '📷 Surat yuborildi',
        isUser: true,
        inputType: hasImage ? 'IMAGE' : 'TEXT',
        imagePreviewBytes: imageBytesToSend,
      ));
      _isLoading = true;
    });

    _scrollToBottom();

    final student = ref.read(studentProvider).student;
    final userAge = student?.age ?? 10;
    final currentLevel = ExerciseRepository.determineLevelForAge(userAge);

    // Capped at 4 recent history items
    final recentHistory = _messages.reversed.take(4).toList().reversed.map((m) => {
      'role': m.isUser ? 'user' : 'model',
      'text': m.text,
    }).toList();

    try {
      if (hasImage) {
        // Send image analysis request
        final base64Img = base64Encode(imageBytesToSend!);
        final res = await ApiClient().dio.post('/ai/chat/image', data: {
          'messageId': messageId,
          'current_question': text.isNotEmpty ? text : null,
          'imageBase64': base64Img,
          'mimeType': 'image/jpeg',
          'fileName': 'matematika_surati.jpg',
          'prompt': text.isNotEmpty ? text : null,
          'conversationId': _activeConversationId,
        });

        if (!mounted) return;

        if (res.data['success'] == true) {
          final data = res.data['data'];
          final convId = data['conversationId'];
          if (convId != null) _activeConversationId = convId;

          final reply = data['reply'] as String? ?? 'Rasm tahlil qilindi.';
          final solution = data['solution'];

          setState(() {
            _messages.add(MessageItem(
              text: reply,
              isUser: false,
              formulaLatex: solution != null ? solution['formulaLatex'] : null,
              finalAnswer: solution != null ? solution['finalAnswer'] : null,
              inputType: 'IMAGE',
            ));
          });
          _fetchConversations();
          _fetchQuotaStatus();
        }
      } else {
        // Send regular text chat request with history and level
        final res = await ApiClient().dio.post('/ai/chat', data: {
          'messageId': messageId,
          'current_question': text,
          'message': text,
          'action': action,
          'step': _currentStep,
          'conversationId': _activeConversationId,
          'level': currentLevel,
          'history': recentHistory,
        });

        if (!mounted) return;

        if (res.data['success'] == true) {
          final data = res.data['data'];
          final convId = data['conversationId'];
          if (convId != null) _activeConversationId = convId;

          final reply = data['reply'] as String;
          final formula = data['formulaLatex'] as String?;
          final finalAns = data['finalAnswer'] as String?;
          final rawSteps = data['steps'] as List<dynamic>?;
          final steps = rawSteps?.map((s) => SolutionStep.fromJson(s)).toList();
          final actions = (data['suggestedActions'] as List<dynamic>?)
              ?.map((e) => e.toString())
              .toList();

          setState(() {
            _messages.add(MessageItem(
              text: reply,
              isUser: false,
              formulaLatex: formula,
              steps: steps,
              finalAnswer: finalAns,
              suggestedActions: actions,
              inputType: 'TEXT',
            ));
            _currentStep = data['step'] ?? (_currentStep + 1);
            if (!_isPro && data['remainingQuota'] != null) {
              _remainingQuota = data['remainingQuota'];
            }
          });
          _fetchConversations();
        }
      }
    } catch (e) {
      if (!mounted) return;
      _handleTextSendError(
        e,
        customText: text,
        action: action,
        retryCount: retryCount,
      );
    } finally {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _isSending = false;
        });
        _scrollToBottom();
      }
    }
  }

  void _handleTextSendError(
    dynamic e, {
    required String customText,
    required String action,
    required int retryCount,
  }) {
    if (!mounted) return;

    if (e is DioException && e.response?.statusCode == 429) {
      final responseData = e.response?.data;
      final isQuotaLimit = responseData is Map &&
          (responseData['code'] == 'AI_QUOTA_EXCEEDED' ||
           responseData['error']?.toString().contains('bepul') == true);

      if (isQuotaLimit) {
        _showQuotaExceededDialog();
        setState(() {
          _messages.add(MessageItem(
            text:
                'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.\nCheksiz savollar berish uchun MathCity Pro ga obuna bo‘ling!',
            isUser: false,
            suggestedActions: ['Pro tarifiga o‘tish (Cheksiz savollar)'],
          ));
        });
        return;
      }

      // Upstream busy / rate limit: exponential backoff up to 2 retries (1.5s, 3s)
      if (retryCount < 2) {
        final backoffMs = retryCount == 0 ? 1500 : 3000;
        Future.delayed(Duration(milliseconds: backoffMs), () {
          if (mounted) {
            _sendMessage(customText: customText, action: action, retryCount: retryCount + 1);
          }
        });
      } else {
        setState(() {
          _messages.add(MessageItem(
            text: 'Ustoz biroz band, 10 soniyadan keyin urinib ko‘ring.',
            isUser: false,
          ));
        });
      }
    } else {
      debugPrint('🚨 [ZiyoTutor] Xatolik: $e');
      setState(() {
        _messages.add(MessageItem(
          text:
              'Savolingiz qabul qilindi. Matematika qoidalari bo‘yicha qadam-baqam yechim tayyorlanmoqda.',
          isUser: false,
        ));
      });
    }
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _showQuotaExceededDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: Colors.white,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.workspace_premium_rounded, color: Color(0xFF6C5CE7), size: 28),
            SizedBox(width: 12),
            Text(
              'Limit tugadi',
              style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF1E1742)),
            ),
          ],
        ),
        content: const Text(
          'Bugungi 5 ta bepul AI so‘rovingiz tugadi. MathCity Pro obunasiga o‘ting va AI Ustozdan cheksiz savollar bilan foydalaning!',
          style: TextStyle(color: Color(0xFF64748B), height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Keyinroq', style: TextStyle(color: Color(0xFF64748B))),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: const Color(0xFF6C5CE7),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: () {
              Navigator.pop(ctx);
              context.push('/payment/add');
            },
            child: const Text('Pro tarifiga o‘tish (29 000 UZS)', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
        ],
      ),
    );
  }

  void _openHistoryBottomSheet() {
    final colors = AppThemeColors.of(context);

    showModalBottomSheet(
      context: context,
      backgroundColor: colors.card,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setSheetState) => Container(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
          height: MediaQuery.of(context).size.height * 0.7,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'So‘nggi suhbatlar',
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                      color: colors.ink,
                    ),
                  ),
                  IconButton(
                    icon: Icon(Icons.add_circle_outline_rounded, color: colors.primary, size: 26),
                    tooltip: 'Yangi suhbat',
                    onPressed: () {
                      Navigator.pop(ctx);
                      _startNewConversation();
                    },
                  ),
                ],
              ),
              Divider(height: 20, color: colors.border),
              Expanded(
                child: _conversations.isEmpty
                    ? Center(
                        child: Text(
                          'Saqlangan suhbatlar topilmadi.\nYangi savol berib suhbatni boshlang!',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: colors.muted, fontSize: 13),
                        ),
                      )
                    : ListView.builder(
                        itemCount: _conversations.length,
                        itemBuilder: (context, index) {
                          final conv = _conversations[index];
                          final isSelected = conv.id == _activeConversationId;
                          return Container(
                            margin: const EdgeInsets.only(bottom: 8),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? colors.primary.withOpacity(0.12)
                                  : colors.field,
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? colors.primary : colors.border,
                              ),
                            ),
                            child: ListTile(
                              leading: Icon(
                                Icons.chat_bubble_outline_rounded,
                                color: isSelected ? colors.primary : colors.muted,
                                size: 20,
                              ),
                              title: Text(
                                conv.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                  color: isSelected ? colors.primary : colors.ink,
                                  fontSize: 14,
                                ),
                              ),
                              subtitle: Text(
                                conv.preview,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(fontSize: 12, color: colors.muted),
                              ),
                              trailing: IconButton(
                                icon: const Icon(Icons.delete_outline_rounded, size: 18, color: Color(0xFFEF4444)),
                                onPressed: () {
                                  _deleteConversation(conv.id);
                                  setSheetState(() {
                                    _conversations.removeWhere((c) => c.id == conv.id);
                                  });
                                },
                              ),
                              onTap: () {
                                Navigator.pop(ctx);
                                _loadConversation(conv.id);
                              },
                            ),
                          );
                        },
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _copySolution(MessageItem msg) {
    final buffer = StringBuffer();
    buffer.writeln(msg.text);
    if (msg.formulaLatex != null && msg.formulaLatex!.isNotEmpty) {
      buffer.writeln(msg.formulaLatex);
    }
    if (msg.steps != null && msg.steps!.isNotEmpty) {
      for (final s in msg.steps!) {
        buffer.writeln('${s.stepNumber}-qadam: ${s.explanation}');
        if (s.latex.isNotEmpty) buffer.writeln(s.latex);
      }
    }
    if (msg.finalAnswer != null && msg.finalAnswer!.isNotEmpty) {
      buffer.writeln('Javob: ${msg.finalAnswer}');
    }
    Clipboard.setData(ClipboardData(text: buffer.toString().trim()));
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Yechim nusxalandi!'),
        duration: Duration(seconds: 1),
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = colors.isDark;
    final student = ref.watch(studentProvider).student;
    final displayName = (student != null && student.displayName.trim().isNotEmpty)
        ? student.displayName.trim()
        : 'O‘quvchi';

    return LayoutBuilder(
      builder: (context, constraints) {
        final screenType = getScreenType(constraints.maxWidth);
        final isDesktop = screenType == ScreenType.expanded;

        return Scaffold(
          backgroundColor: colors.bg,
          appBar: _buildAppBar(isDesktop, colors, isDark),
          body: Row(
            children: [
              // Desktop History Sidebar
              if (isDesktop && _showDesktopSidebar)
                _buildDesktopSidebar(colors, isDark),

              // Main Chat Area
              Expanded(
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 860),
                    child: Column(
                      children: [
                        // Messages or Welcoming Greeting
                        Expanded(
                          child: _messages.isEmpty
                              ? _buildWelcomingState(displayName, colors, isDark)
                              : _buildMessageList(colors, isDark),
                        ),

                        // Selected Image Preview Banner
                        if (_selectedImageBytes != null)
                          _buildSelectedImageBanner(colors, isDark),

                        // Voice Recording Bar or Input Composer
                        if (_isRecording)
                          _buildVoiceRecordingBar(colors, isDark)
                        else
                          _buildInputComposer(colors, isDark),
                      ],
                    ),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  PreferredSizeWidget _buildAppBar(bool isDesktop, AppThemeColors colors, bool isDark) {
    return AppBar(
      backgroundColor: colors.card,
      elevation: 0,
      titleSpacing: 0,
      leading: IconButton(
        icon: Icon(Icons.arrow_back_ios_new_rounded, color: colors.ink),
        onPressed: () {
          if (context.canPop()) {
            context.pop();
          } else {
            context.go('/kids/home');
          }
        },
      ),
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(6),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF282055) : const Color(0xFFEDE9FE),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(Icons.auto_awesome_rounded, color: colors.primary, size: 18),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'AI Ustoz',
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontWeight: FontWeight.w800,
                    fontSize: 16,
                    color: colors.ink,
                  ),
                ),
                if (isDesktop)
                  Text(
                    'Shaxsiy matematika repetitori',
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(fontSize: 11, color: colors.muted, fontWeight: FontWeight.w500),
                  ),
              ],
            ),
          ),
        ],
      ),
      actions: [
        // Quota Badge
        Center(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 2),
            padding: EdgeInsets.symmetric(horizontal: isDesktop ? 10 : 7, vertical: 4),
            decoration: BoxDecoration(
              color: _isPro
                  ? (isDark ? const Color(0xFF143828) : const Color(0xFFE8F8EE))
                  : colors.field,
              borderRadius: BorderRadius.circular(999),
              border: Border.all(
                color: _isPro ? const Color(0xFF10B981) : colors.border,
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _isPro ? Icons.stars_rounded : Icons.bolt_rounded,
                  color: _isPro ? const Color(0xFF10B981) : colors.primary,
                  size: 13,
                ),
                const SizedBox(width: 3),
                Text(
                  _isPro
                      ? (isDesktop ? 'Pro — Cheksiz' : 'Pro')
                      : (isDesktop ? '$_remainingQuota/5 bepul' : '$_remainingQuota/5'),
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: _isPro ? const Color(0xFF10B981) : colors.muted,
                  ),
                ),
              ],
            ),
          ),
        ),

        // History Button ("Tarix")
        if (isDesktop)
          TextButton.icon(
            onPressed: () => setState(() => _showDesktopSidebar = !_showDesktopSidebar),
            icon: Icon(Icons.history_rounded, size: 18, color: colors.primary),
            label: Text(
              'Tarix',
              style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: colors.primary),
            ),
          )
        else
          IconButton(
            tooltip: 'Tarix',
            padding: const EdgeInsets.symmetric(horizontal: 6),
            constraints: const BoxConstraints(),
            onPressed: _openHistoryBottomSheet,
            icon: Icon(Icons.history_rounded, size: 20, color: colors.primary),
          ),
        const SizedBox(width: 4),
      ],
    );
  }

  Widget _buildDesktopSidebar(AppThemeColors colors, bool isDark) {
    return Container(
      width: 290,
      decoration: BoxDecoration(
        color: colors.card,
        border: Border(right: BorderSide(color: colors.border)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'So‘nggi suhbatlar',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: colors.ink),
                ),
                IconButton(
                  icon: Icon(Icons.add_circle_outline_rounded, color: colors.primary, size: 22),
                  tooltip: 'Yangi suhbat boshlash',
                  onPressed: _startNewConversation,
                ),
              ],
            ),
          ),
          Divider(height: 1, color: colors.border),
          Expanded(
            child: _conversations.isEmpty
                ? Center(
                    child: Text(
                      'Saqlangan suhbatlar yo‘q',
                      style: TextStyle(color: colors.muted, fontSize: 12),
                    ),
                  )
                : ListView.builder(
                    itemCount: _conversations.length,
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
                    itemBuilder: (context, index) {
                      final conv = _conversations[index];
                      final isSelected = conv.id == _activeConversationId;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 6),
                        decoration: BoxDecoration(
                          color: isSelected ? colors.primary.withOpacity(0.12) : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? colors.primary : Colors.transparent,
                          ),
                        ),
                        child: ListTile(
                          dense: true,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                          leading: Icon(
                            Icons.chat_bubble_outline_rounded,
                            size: 16,
                            color: isSelected ? colors.primary : colors.muted,
                          ),
                          title: Text(
                            conv.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              color: isSelected ? colors.primary : colors.ink,
                            ),
                          ),
                          subtitle: Text(
                            conv.preview,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(fontSize: 11, color: colors.muted),
                          ),
                          trailing: IconButton(
                            icon: Icon(Icons.delete_outline_rounded, size: 16, color: colors.muted),
                            onPressed: () => _deleteConversation(conv.id),
                          ),
                          onTap: () => _loadConversation(conv.id),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomingState(String displayName, AppThemeColors colors, bool isDark) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Column(
        children: [
          // Animated Mascot Avatar
          _MascotAvatar(isDark: isDark, primaryColor: colors.primary),
          const SizedBox(height: 20),

          // Greeting
          Text(
            'Salom, $displayName! 👋',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: colors.ink,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            'Men sizning AI matematik ustozingizman.\nBugun sizga qanday yordam bera olaman?',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w500,
              color: colors.muted,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 28),

          // Starter Prompts
          Wrap(
            spacing: 10,
            runSpacing: 10,
            alignment: WrapAlignment.center,
            children: _starterPrompts.map((prompt) {
              return InkWell(
                onTap: () => _sendMessage(customText: prompt),
                borderRadius: BorderRadius.circular(16),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    color: colors.card,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: colors.border),
                    boxShadow: [
                      BoxShadow(
                        color: isDark ? Colors.black26 : const Color(0x04000000),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.help_outline_rounded, size: 16, color: colors.primary),
                      const SizedBox(width: 8),
                      Text(
                        prompt,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: colors.ink,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageList(AppThemeColors colors, bool isDark) {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      itemCount: _messages.length + (_isLoading ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _messages.length && _isLoading) {
          return _buildLoadingBubble(colors, isDark);
        }
        return _buildMessageBubble(_messages[index], colors, isDark);
      },
    );
  }

  Widget _buildMessageBubble(MessageItem msg, AppThemeColors colors, bool isDark) {
    if (msg.isUser) {
      return Align(
        alignment: Alignment.centerRight,
        child: Container(
          margin: const EdgeInsets.only(bottom: 14),
          constraints: const BoxConstraints(maxWidth: 540),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [colors.primary, colors.primaryDark],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20).copyWith(bottomRight: const Radius.circular(4)),
            boxShadow: [
              BoxShadow(
                color: colors.primary.withOpacity(0.25),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              if (msg.imagePreviewBytes != null) ...[
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Image.memory(
                    msg.imagePreviewBytes!,
                    height: 140,
                    fit: BoxFit.cover,
                  ),
                ),
                const SizedBox(height: 8),
              ],
              Text(
                msg.text,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: Colors.white,
                  height: 1.35,
                ),
              ),
            ],
          ),
        ),
      );
    }

    // AI Ustoz Response Bubble
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        constraints: const BoxConstraints(maxWidth: 620),
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(24).copyWith(topLeft: const Radius.circular(4)),
          border: Border.all(color: colors.border),
          boxShadow: [
            BoxShadow(
              color: isDark ? Colors.black26 : const Color(0x06000000),
              blurRadius: 16,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // AI Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(5),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF282055) : const Color(0xFFEDE9FE),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.smart_toy_rounded, size: 16, color: colors.primary),
                ),
                const SizedBox(width: 8),
                Text(
                  'AI Ustoz',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: colors.primary),
                ),
                const Spacer(),
                IconButton(
                  icon: Icon(
                    _isSpeaking ? Icons.volume_up_rounded : Icons.volume_down_rounded,
                    size: 18,
                    color: colors.primary,
                  ),
                  tooltip: 'Ovozli eshitish',
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                  onPressed: () => _speakText(msg.text),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Text message
            Text(
              msg.text,
              style: TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: colors.ink,
                height: 1.45,
              ),
            ),

            // Formula LaTeX display
            if (msg.formulaLatex != null && msg.formulaLatex!.isNotEmpty) ...[
              const SizedBox(height: 14),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: colors.field,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: colors.border),
                ),
                child: Center(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Math.tex(
                      msg.formulaLatex!,
                      textStyle: TextStyle(fontSize: 18, color: colors.ink),
                    ),
                  ),
                ),
              ),
            ],

            // Step by step breakdown
            if (msg.steps != null && msg.steps!.isNotEmpty) ...[
              const SizedBox(height: 14),
              ...msg.steps!.map((step) => Padding(
                    padding: const EdgeInsets.only(bottom: 8),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        CircleAvatar(
                          radius: 11,
                          backgroundColor: isDark ? const Color(0xFF282055) : const Color(0xFFEDE9FE),
                          child: Text(
                            '${step.stepNumber}',
                            style: TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: colors.primary),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(step.explanation, style: TextStyle(fontSize: 13, color: colors.muted)),
                              if (step.latex.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Math.tex(step.latex, textStyle: TextStyle(fontSize: 14, color: colors.ink)),
                              ],
                            ],
                          ),
                        ),
                      ],
                    ),
                  )),
            ],

            // Final answer highlight
            if (msg.finalAnswer != null && msg.finalAnswer!.isNotEmpty) ...[
              const SizedBox(height: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF143828) : const Color(0xFFE8F8EE),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: const Color(0xFF10B981), width: 1.2),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.check_circle_rounded, color: Color(0xFF10B981), size: 16),
                    const SizedBox(width: 8),
                    Text(
                      'Javob: ${msg.finalAnswer}',
                      style: TextStyle(
                        fontWeight: FontWeight.w800,
                        color: isDark ? const Color(0xFF34D399) : const Color(0xFF047857),
                        fontSize: 14,
                      ),
                    ),
                  ],
                ),
              ),
            ],

            // Action Buttons: Nusxalash, Soddaroq tushuntir, Yana bir misol ber
            const SizedBox(height: 14),
            Wrap(
              spacing: 8,
              runSpacing: 6,
              children: [
                ActionChip(
                  backgroundColor: colors.field,
                  side: BorderSide(color: colors.border),
                  avatar: Icon(Icons.copy_rounded, size: 14, color: colors.primary),
                  label: Text('Nusxalash', style: TextStyle(fontSize: 12, color: colors.ink, fontWeight: FontWeight.w600)),
                  onPressed: () => _copySolution(msg),
                ),
                ActionChip(
                  backgroundColor: colors.field,
                  side: BorderSide(color: colors.border),
                  avatar: Icon(Icons.lightbulb_outline_rounded, size: 14, color: const Color(0xFFF59E0B)),
                  label: Text('Tushunmadim, soddaroq tushuntir', style: TextStyle(fontSize: 12, color: colors.ink, fontWeight: FontWeight.w600)),
                  onPressed: () => _sendMessage(customText: 'Tushunmadim, soddaroq tushuntir', action: 'explain_more'),
                ),
                ActionChip(
                  backgroundColor: colors.field,
                  side: BorderSide(color: colors.border),
                  avatar: Icon(Icons.refresh_rounded, size: 14, color: const Color(0xFF3B82F6)),
                  label: Text('Yana bir misol ber', style: TextStyle(fontSize: 12, color: colors.ink, fontWeight: FontWeight.w600)),
                  onPressed: () => _sendMessage(customText: 'Yana bir shunga o‘xshash misol ber', action: 'similar_example'),
                ),
                if (msg.suggestedActions != null)
                  ...msg.suggestedActions!.map((act) {
                    return ActionChip(
                      backgroundColor: colors.field,
                      side: BorderSide(color: colors.border),
                      label: Text(act, style: TextStyle(fontSize: 12, color: colors.muted, fontWeight: FontWeight.w600)),
                      onPressed: () {
                        if (act.contains('Pro')) {
                          context.push('/payment/add');
                        } else {
                          _sendMessage(customText: act);
                        }
                      },
                    );
                  }),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingBubble(AppThemeColors colors, bool isDark) {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: colors.border),
          boxShadow: [
            BoxShadow(
              color: isDark ? Colors.black26 : const Color(0x06000000),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            _BouncingDotsIndicator(color: colors.primary),
            const SizedBox(width: 12),
            Text(
              'AI Ustoz yozmoqda...',
              style: TextStyle(
                fontSize: 13,
                color: colors.muted,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectedImageBanner(AppThemeColors colors, bool isDark) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.primary),
      ),
      child: Row(
        children: [
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.memory(
              _selectedImageBytes!,
              width: 44,
              height: 44,
              fit: BoxFit.cover,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Galereyadan surat tanlandi',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: colors.ink),
                ),
                Text(
                  'Savol yozing yoki darhol yechish uchun yuboring',
                  style: TextStyle(fontSize: 11, color: colors.muted),
                ),
              ],
            ),
          ),
          IconButton(
            icon: const Icon(Icons.cancel_rounded, color: Color(0xFFEF4444)),
            onPressed: _clearSelectedImage,
          ),
        ],
      ),
    );
  }

  Widget _buildVoiceRecordingBar(AppThemeColors colors, bool isDark) {
    final minutes = (_recordingSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (_recordingSeconds % 60).toString().padLeft(2, '0');

    return Container(
      margin: const EdgeInsets.all(12),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: colors.card,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFFEF4444), width: 1.5),
        boxShadow: const [
          BoxShadow(color: Color(0x1AEF4444), blurRadius: 16, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 10,
            height: 10,
            decoration: const BoxDecoration(
              color: Color(0xFFEF4444),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 8),
          Flexible(
            child: Text(
              _liveTranscript.isNotEmpty
                  ? '🎙️ "$_liveTranscript"'
                  : 'Ovoz yozilmoqda: $minutes:$seconds',
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(fontWeight: FontWeight.w700, color: Color(0xFFEF4444), fontSize: 13),
            ),
          ),
          const SizedBox(width: 8),
          TextButton(
            style: TextButton.styleFrom(
              padding: const EdgeInsets.symmetric(horizontal: 6),
              minimumSize: Size.zero,
              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
            ),
            onPressed: _cancelRecording,
            child: Text('Bekor qilish', style: TextStyle(color: colors.muted, fontSize: 12)),
          ),
          const SizedBox(width: 4),
          IconButton(
            padding: EdgeInsets.zero,
            constraints: const BoxConstraints(),
            icon: const Icon(Icons.stop_circle_rounded, color: Color(0xFFEF4444), size: 30),
            onPressed: _finishVoiceRecording,
          ),
        ],
      ),
    );
  }

  Widget _buildInputComposer(AppThemeColors colors, bool isDark) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      decoration: BoxDecoration(
        color: colors.card,
        border: Border(top: BorderSide(color: colors.border)),
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            // Gallery image picker button
            _buildActionSquareButton(
              icon: Icons.photo_library_rounded,
              tooltip: 'Galereyadan rasm tanlash',
              colors: colors,
              onTap: (_isLoading || _isSending) ? null : _pickGalleryImage,
            ),
            const SizedBox(width: 6),

            // Voice recording button
            _buildActionSquareButton(
              icon: Icons.mic_rounded,
              tooltip: 'Ovozli xabar yuborish',
              colors: colors,
              onTap: (_isLoading || _isSending) ? null : _toggleRecording,
            ),
            const SizedBox(width: 6),

            // Message text input
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: colors.field,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: colors.border),
                ),
                child: TextField(
                  controller: _textController,
                  enabled: !_isLoading && !_isSending,
                  style: TextStyle(
                    fontSize: 14,
                    color: colors.ink,
                    fontWeight: FontWeight.w500,
                  ),
                  onSubmitted: (_) {
                    if (!_isLoading && !_isSending) _sendMessage();
                  },
                  decoration: InputDecoration(
                    hintText: (_isLoading || _isSending)
                        ? 'Ustoz javob bermoqda...'
                        : 'Savol, misol yoki tenglamani yozing...',
                    hintStyle: TextStyle(fontSize: 13, color: colors.inactive),
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(vertical: 10),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 6),

            // Send button
            _buildActionSquareButton(
              icon: Icons.send_rounded,
              tooltip: 'Yuborish',
              colors: colors,
              isPrimary: true,
              onTap: (_isLoading || _isSending) ? null : () => _sendMessage(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildActionSquareButton({
    required IconData icon,
    required String tooltip,
    required AppThemeColors colors,
    required VoidCallback? onTap,
    bool isPrimary = false,
  }) {
    final isDisabled = onTap == null;
    final bgColor = isPrimary
        ? (isDisabled ? colors.primary.withOpacity(0.4) : colors.primary)
        : (isDisabled ? colors.field.withOpacity(0.4) : colors.field);

    return Material(
      color: bgColor,
      borderRadius: BorderRadius.circular(20),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          width: 44,
          height: 44,
          alignment: Alignment.center,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            border: Border.all(
              color: isPrimary
                  ? (isDisabled ? colors.primary.withOpacity(0.3) : colors.primary)
                  : colors.border,
            ),
          ),
          child: Icon(
            icon,
            size: 20,
            color: isPrimary
                ? Colors.white
                : (isDisabled ? colors.inactive : colors.primary),
          ),
        ),
      ),
    );
  }
}

class _MascotAvatar extends StatefulWidget {
  final bool isDark;
  final Color primaryColor;
  const _MascotAvatar({required this.isDark, required this.primaryColor});

  @override
  State<_MascotAvatar> createState() => _MascotAvatarState();
}

class _MascotAvatarState extends State<_MascotAvatar>
    with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2400),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        final floatOffset = _controller.value * 6.0;
        final scale = 1.0 + (_controller.value * 0.04);
        return Transform.translate(
          offset: Offset(0, -floatOffset),
          child: Transform.scale(
            scale: scale,
            child: Container(
              width: 96,
              height: 96,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: widget.isDark
                      ? [const Color(0xFF382B7D), const Color(0xFF1E1742)]
                      : [const Color(0xFFEDE9FE), const Color(0xFFDDD6FE)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: widget.primaryColor.withOpacity(widget.isDark ? 0.3 : 0.2),
                    blurRadius: 20,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: Center(
                child: Icon(
                  Icons.smart_toy_rounded,
                  size: 54,
                  color: widget.primaryColor,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

class _BouncingDotsIndicator extends StatefulWidget {
  final Color color;
  const _BouncingDotsIndicator({required this.color});

  @override
  State<_BouncingDotsIndicator> createState() => _BouncingDotsIndicatorState();
}

class _BouncingDotsIndicatorState extends State<_BouncingDotsIndicator>
    with SingleTickerProviderStateMixin {
  late AnimationController _animController;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    )..repeat();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _animController,
      builder: (context, child) {
        return Row(
          mainAxisSize: MainAxisSize.min,
          children: List.generate(3, (index) {
            final delay = index * 0.2;
            final val = (_animController.value - delay) % 1.0;
            final bounce = (val < 0.5) ? (val * 2) : ((1.0 - val) * 2);
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 2.5),
              width: 7,
              height: 7 + (bounce * 4),
              decoration: BoxDecoration(
                color: widget.color.withOpacity(0.4 + (bounce * 0.6)),
                borderRadius: BorderRadius.circular(4),
              ),
            );
          }),
        );
      },
    );
  }
}
