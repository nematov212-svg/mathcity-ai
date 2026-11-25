import 'dart:async';
import 'dart:convert';
import 'dart:io' show File, Platform;
import 'dart:math' as math;
import 'dart:ui' as ui;
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
import '../../core/responsive/app_responsive_scaffold.dart';
import '../../core/widgets/kids_shell_layout.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
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

class _ZiyoTutorScreenState extends ConsumerState<ZiyoTutorScreen>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late AnimationController _cosmicController;
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

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _cosmicController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 16),
    );
    if (!kIsWeb && Platform.environment.containsKey('FLUTTER_TEST')) {
      _cosmicController.value = 0.5;
    } else {
      _cosmicController.repeat();
    }
    _fetchQuotaStatus();
    _fetchConversations();
    _initSpeech();
    _initTts();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    if (state == AppLifecycleState.resumed) {
      if (!_cosmicController.isAnimating &&
          !(kDebugMode && !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST'))) {
        _cosmicController.repeat();
      }
    } else {
      if (_cosmicController.isAnimating) {
        _cosmicController.stop();
      }
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _cosmicController.dispose();
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
        // Never fallback to ru_RU or en_US when user speaks Uzbek. Keep uz_UZ or use server STT
        _speechLocale = uzLocale?.localeId ?? 'uz_UZ';
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
      await _flutterTts.setSpeechRate(0.88);
      _flutterTts.setCompletionHandler(() {
        if (mounted) setState(() => _isSpeaking = false);
      });
      _flutterTts.setErrorHandler((dynamic err) {
        debugPrint('ℹ️ [TTS] Handled SpeechSynthesis error: $err');
        if (mounted) setState(() => _isSpeaking = false);
      });
      _flutterTts.setCancelHandler(() {
        if (mounted) setState(() => _isSpeaking = false);
      });
    } catch (e) {
      debugPrint('ℹ️ [TTS] Init exception: $e');
    }
  }

  String _prepareSpokenText(String input) {
    String text = input
        .replaceAll(RegExp(r'\*\*|\*|#|`|_'), '')
        .replaceAll(RegExp(r'\\[a-zA-Z]+'), ' ')
        .trim();

    // Map mathematical symbols to spoken Uzbek words
    text = text
        .replaceAll('×', ' ko‘paytirish ')
        .replaceAll('*', ' ko‘paytirish ')
        .replaceAll('+', ' qo‘shish ')
        .replaceAll('−', ' ayirish ')
        .replaceAll('–', ' ayirish ')
        .replaceAll('-', ' ayirish ')
        .replaceAll('÷', ' bo‘lish ')
        .replaceAll(':', ' bo‘lish ')
        .replaceAll('=', ' teng ')
        .replaceAll('≠', ' teng emas ')
        .replaceAll('≈', ' taqriban teng ')
        .replaceAll('>', ' katta ')
        .replaceAll('<', ' kichik ')
        .replaceAll('≥', ' katta yoki teng ')
        .replaceAll('≤', ' kichik yoki teng ')
        .replaceAll('%', ' foiz ')
        .replaceAll('²', ' kvadrat ')
        .replaceAll('³', ' kub ')
        .replaceAll('½', ' ikkidan bir, ya’ni yarim ')
        .replaceAll('¼', ' to‘rtdan bir, ya’ni chorak ')
        .replaceAll('¾', ' to‘rtdan uch ');

    // Convert "2 ko‘paytirish 5" into words "ikki ko‘paytirish besh"
    text = text.replaceAllMapped(RegExp(r'(\d+)\s*ko‘paytirish\s*(\d+)'), (m) {
      final n1 = _numberToWord(int.tryParse(m.group(1) ?? '') ?? 0);
      final n2 = _numberToWord(int.tryParse(m.group(2) ?? '') ?? 0);
      return '$n1 ko‘paytirish $n2';
    });

    return text.replaceAll(RegExp(r'\s+'), ' ').trim();
  }

  static String _numberToWord(int n) {
    if (n == 0) return 'nol';
    const ones = ['', 'bir', 'ikki', 'uch', 'to‘rt', 'besh', 'olti', 'yetti', 'sakkiz', 'to‘qqiz'];
    const tens = ['', 'o‘n', 'yigirma', 'o‘ttiz', 'qirq', 'ellik', 'oltmish', 'yetmish', 'sakson', 'to‘qson'];
    if (n < 10) return ones[n];
    if (n < 100) {
      final t = n ~/ 10;
      final o = n % 10;
      return '${tens[t]} ${ones[o]}'.trim();
    }
    return '$n';
  }

  Future<void> _speakText(String text) async {
    try {
      if (_isSpeaking) {
        await _flutterTts.stop();
        if (mounted) setState(() => _isSpeaking = false);
        return;
      }
      final cleanText = _prepareSpokenText(text);
      if (cleanText.isEmpty) return;
      if (mounted) setState(() => _isSpeaking = true);
      await _flutterTts.speak(cleanText);
    } catch (e) {
      debugPrint('ℹ️ [TTS] Handled speak exception gracefully: $e');
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

  void _showImageSourceDialog() {
    final colors = AppThemeColors.of(context);
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      builder: (ctx) => Container(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
        decoration: BoxDecoration(
          color: colors.card,
          borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
        ),
        child: SafeArea(
          top: false,
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: colors.muted.withOpacity(0.3),
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 18),
              Text(
                'Matematika savolini rasmga olish',
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.w800, color: colors.ink),
              ),
              const SizedBox(height: 18),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: colors.primary.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.camera_alt_rounded, color: colors.primary),
                ),
                title: Text('Kamera orqali suratga olish', style: TextStyle(fontWeight: FontWeight.w700, color: colors.ink)),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.camera);
                },
              ),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: colors.primary.withOpacity(0.12),
                    shape: BoxShape.circle,
                  ),
                  child: Icon(Icons.photo_library_rounded, color: colors.primary),
                ),
                title: Text('Galereyadan tanlash', style: TextStyle(fontWeight: FontWeight.w700, color: colors.ink)),
                onTap: () {
                  Navigator.pop(ctx);
                  _pickImage(ImageSource.gallery);
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      if (kIsWeb && source == ImageSource.gallery) {
        final result = await FilePicker.pickFiles(type: FileType.image, withData: true);
        if (!mounted || result == null || result.files.isEmpty) return;
        final bytes = result.files.first.bytes;
        if (bytes != null) {
          if (bytes.lengthInBytes > 2 * 1024 * 1024) {
            _showImageSizeError();
            return;
          }
          setState(() => _selectedImageBytes = bytes);
          return;
        }
      }

      final XFile? image = await _picker.pickImage(
        source: source,
        maxWidth: 1600,
        maxHeight: 1600,
        imageQuality: 85,
      );
      if (!mounted || image == null) return;
      final fileBytes = await image.readAsBytes();
      if (fileBytes.lengthInBytes > 2 * 1024 * 1024) {
        _showImageSizeError();
        return;
      }
      setState(() => _selectedImageBytes = fileBytes);
    } catch (e) {
      debugPrint('⚠️ Rasm tanlashda ogohlantirish: $e');
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Rasm tanlashda xatolik yuz berdi. Iltimos, qayta urinib ko‘ring.'),
            backgroundColor: Color(0xFFDC2626),
          ),
        );
      }
    }
  }

  void _showImageSizeError() {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Rasm hajmi 2 MB dan oshmasligi kerak.'),
        backgroundColor: Color(0xFFDC2626),
      ),
    );
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

    _recordingTimer?.cancel();

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

    try {
      await _speech.cancel();
    } catch (_) {}
    _disposeRecorder();

    setState(() {
      _isRecording = false;
      _recordingSeconds = 0;
      _liveTranscript = '';
      if (transcriptToSend.isNotEmpty) {
        _textController.text = transcriptToSend;
      }
    });

    if (transcriptToSend.isNotEmpty) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('🎙️ Ovoz matnga o‘girildi. Matnni tekshirib yoki tahrirlab, Yuborish tugmasini bosing.'),
            backgroundColor: Color(0xFF6C47FF),
            duration: Duration(seconds: 3),
          ),
        );
      }
    } else if (path != null && path.isNotEmpty) {
      _sendVoiceMessage(path: path, transcript: '');
    }
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
        final screenWidth = constraints.maxWidth;
        final isDesktop = screenWidth >= 1024;
        final disableAnim = MediaQuery.of(context).disableAnimations;

        Widget buildBodyContent({required bool wideMode}) {
          return Row(
            children: [
              if (wideMode && isDesktop && _showDesktopSidebar)
                _buildDesktopSidebar(colors, isDark),
              Expanded(
                child: Center(
                  child: ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 860),
                    child: _messages.isEmpty
                        ? _buildWelcomingState(displayName, colors, isDark)
                        : _buildMessageList(colors, isDark),
                  ),
                ),
              ),
            ],
          );
        }

        final mainForeground = SafeArea(
          top: false,
          bottom: false,
          child: Column(
            children: [
              _buildGlassHeader(isDesktop, colors),
              Expanded(
                child: buildBodyContent(wideMode: screenWidth >= 600),
              ),
              if (_selectedImageBytes != null)
                _buildSelectedImageBanner(colors, isDark),
              if (_isRecording)
                _buildVoiceRecordingBar(colors, isDark)
              else
                _buildInputComposer(colors, isDark),
            ],
          ),
        );

        final stackWithBackground = Stack(
          children: [
            // Full-screen Cosmic Star & Floating 3D Coin Background
            Positioned.fill(
              child: IgnorePointer(
                child: RepaintBoundary(
                  child: AnimatedBuilder(
                    animation: _cosmicController,
                    builder: (context, _) {
                      return CustomPaint(
                        painter: CosmicBackgroundPainter(
                          progress: disableAnim ? 0.0 : _cosmicController.value,
                          hasMessages: _messages.isNotEmpty,
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
            mainForeground,
          ],
        );

        if (screenWidth < 600) {
          return Scaffold(
            backgroundColor: const Color(0xFF0F0A2A),
            bottomNavigationBar: (KidsNavShellScope.of(context) || MediaQuery.of(context).viewInsets.bottom > 0)
                ? null
                : const MathCityBottomNav(currentIndex: 2),
            body: stackWithBackground,
          );
        }

        return AppResponsiveScaffold(
          currentNavIndex: 2,
          title: 'Ziyo — AI Ustoz',
          backgroundColor: const Color(0xFF0F0A2A),
          phoneBody: const SizedBox.shrink(),
          tabletBody: stackWithBackground,
          desktopBody: stackWithBackground,
        );
      },
    );
  }

  Widget _buildGlassHeader(bool isDesktop, AppThemeColors colors) {
    return Container(
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [
            Color(0xDD0D0726), // Translucent deep indigo
            Color(0xB81A0D3D), // Translucent royal violet
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        border: Border(
          bottom: BorderSide(
            color: Colors.white.withOpacity(0.12),
            width: 1.0,
          ),
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.35),
            blurRadius: 18,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ClipRect(
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: 18, sigmaY: 18),
          child: SafeArea(
            bottom: false,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              child: Row(
                children: [
                  // Back button with tactile scale feedback
                  _GlassActionButton(
                    tooltip: 'Orqaga',
                    onTap: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/kids/home');
                      }
                    },
                    child: const Icon(
                      Icons.arrow_back_ios_new_rounded,
                      color: Colors.white,
                      size: 18,
                    ),
                  ),
                  const SizedBox(width: 10),

                  // 40x40 AI Ustoz Logo with subtle violet glow
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF7C3AED).withOpacity(0.45),
                          blurRadius: 10,
                          spreadRadius: 1,
                        ),
                      ],
                    ),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: Image.asset(
                        'assets/images/ai_ustoz_logo.png',
                        width: 40,
                        height: 40,
                        fit: BoxFit.cover,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),

                  // Title & Subtitle with glowing green online dot
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Text(
                          'AI Ustoz',
                          overflow: TextOverflow.ellipsis,
                          style: TextStyle(
                            fontFamily: 'Nunito',
                            fontWeight: FontWeight.w800,
                            fontSize: 16,
                            color: Colors.white,
                            letterSpacing: -0.2,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Container(
                              width: 7,
                              height: 7,
                              decoration: BoxDecoration(
                                shape: BoxShape.circle,
                                color: const Color(0xFF10B981),
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFF10B981).withOpacity(0.7),
                                    blurRadius: 4,
                                    spreadRadius: 1,
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 5),
                            const Flexible(
                              child: Text(
                                'Matematika ustozing',
                                overflow: TextOverflow.ellipsis,
                                maxLines: 1,
                                style: TextStyle(
                                  fontFamily: 'Nunito',
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: Color(0xFFC7D2FE),
                                ),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  // 5/5 Energy Quota Pill with shiny border and glow
                  _buildQuotaBadge(isDesktop, colors),
                  const SizedBox(width: 8),

                  // History Button
                  _GlassActionButton(
                    tooltip: 'Tarix',
                    onTap: isDesktop
                        ? () => setState(() => _showDesktopSidebar = !_showDesktopSidebar)
                        : _openHistoryBottomSheet,
                    child: const Icon(
                      Icons.history_rounded,
                      color: Colors.white,
                      size: 20,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuotaBadge(bool isDesktop, AppThemeColors colors) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 2),
      padding: EdgeInsets.symmetric(horizontal: isDesktop ? 10 : 8, vertical: 5),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: _isPro
              ? [const Color(0x3310B981), const Color(0x22059669)]
              : [const Color(0x337C3AED), const Color(0x224F46E5)],
        ),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(
          color: _isPro
              ? const Color(0xFF34D399).withOpacity(0.6)
              : const Color(0xFFA78BFA).withOpacity(0.5),
          width: 1.2,
        ),
        boxShadow: [
          BoxShadow(
            color: (_isPro ? const Color(0xFF10B981) : const Color(0xFF8B5CF6)).withOpacity(0.2),
            blurRadius: 8,
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(
            _isPro ? Icons.stars_rounded : Icons.bolt_rounded,
            color: _isPro ? const Color(0xFF34D399) : const Color(0xFFFBBF24),
            size: 13,
          ),
          const SizedBox(width: 4),
          Text(
            _isPro
                ? (isDesktop ? 'Pro — Cheksiz' : 'Pro')
                : (isDesktop ? '$_remainingQuota/5 bepul' : '$_remainingQuota/5'),
            style: TextStyle(
              fontFamily: 'Nunito',
              fontSize: 11,
              fontWeight: FontWeight.w800,
              color: _isPro ? const Color(0xFF6EE7B7) : Colors.white,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDesktopSidebar(AppThemeColors colors, bool isDark) {
    return Container(
      width: 290,
      decoration: BoxDecoration(
        color: const Color(0xEE10082E),
        border: Border(right: BorderSide(color: Colors.white.withOpacity(0.12))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Expanded(
                  child: Text(
                    'So‘nggi suhbatlar',
                    maxLines: 1,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                    ),
                  ),
                ),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline_rounded, color: Color(0xFFA78BFA), size: 22),
                  tooltip: 'Yangi suhbat boshlash',
                  onPressed: _startNewConversation,
                ),
              ],
            ),
          ),
          Divider(height: 1, color: Colors.white.withOpacity(0.10)),
          Expanded(
            child: _conversations.isEmpty
                ? const Center(
                    child: Text(
                      'Saqlangan suhbatlar yo‘q',
                      style: TextStyle(color: Color(0xFFC7D2FE), fontSize: 12),
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
                          color: isSelected ? const Color(0x337C3AED) : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? const Color(0xFFA78BFA) : Colors.transparent,
                          ),
                        ),
                        child: ListTile(
                          dense: true,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                          leading: Icon(
                            Icons.chat_bubble_outline_rounded,
                            size: 16,
                            color: isSelected ? const Color(0xFFA78BFA) : const Color(0xFF94A3B8),
                          ),
                          title: Text(
                            conv.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 13,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              color: isSelected ? Colors.white : const Color(0xFFE2E8F0),
                            ),
                          ),
                          subtitle: Text(
                            conv.preview,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(
                              fontFamily: 'Nunito',
                              fontSize: 11,
                              color: Color(0xFF94A3B8),
                            ),
                          ),
                          trailing: IconButton(
                            icon: const Icon(Icons.delete_outline_rounded, size: 16, color: Color(0xFF94A3B8)),
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
    final disableAnim = MediaQuery.of(context).disableAnimations;
    return Center(
      child: SingleChildScrollView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 36),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // Animated Hero AI Ustoz Logo with Orbiting Stars & Halo
            _AIUstozHeroLogo(
              animation: _cosmicController,
              disableAnim: disableAnim,
            ),
            const SizedBox(height: 26),

            // Greeting: "Salom, <Student Name>! 👋"
            Text(
              'Salom, $displayName! 👋',
              textAlign: TextAlign.center,
              style: const TextStyle(
                fontFamily: 'Nunito',
                fontSize: 26,
                fontWeight: FontWeight.w900,
                color: Colors.white,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 10),

            // Subtitle
            ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 480),
              child: const Text(
                'Men sizning AI matematik ustozingizman.\nBugun sizga qanday yordam bera olaman?',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontFamily: 'Nunito',
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: Color(0xFFC7D2FE),
                  height: 1.5,
                ),
              ),
            ),
          ],
        ),
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
          color: const Color(0xE017103B),
          borderRadius: BorderRadius.circular(24).copyWith(topLeft: const Radius.circular(4)),
          border: Border.all(color: Colors.white.withOpacity(0.12)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.35),
              blurRadius: 18,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // AI Header with Official AI Ustoz Logo
            Row(
              children: [
                Container(
                  width: 26,
                  height: 26,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(8),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF7C3AED).withOpacity(0.4),
                        blurRadius: 8,
                      ),
                    ],
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: Image.asset(
                      'assets/images/ai_ustoz_logo.png',
                      width: 26,
                      height: 26,
                      fit: BoxFit.cover,
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                const Text(
                  'AI Ustoz',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontWeight: FontWeight.w800,
                    fontSize: 13,
                    color: Color(0xFFA78BFA),
                  ),
                ),
                const Spacer(),
                IconButton(
                  icon: Icon(
                    _isSpeaking ? Icons.stop_circle_rounded : Icons.volume_up_rounded,
                    size: 20,
                    color: _isSpeaking ? const Color(0xFFEF4444) : const Color(0xFFA78BFA),
                  ),
                  tooltip: _isSpeaking ? 'To‘xtatish' : 'Ovozli eshitish',
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
              style: const TextStyle(
                fontFamily: 'Nunito',
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: Colors.white,
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
                  color: Colors.white.withOpacity(0.06),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white.withOpacity(0.12)),
                ),
                child: Center(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Math.tex(
                      msg.formulaLatex!,
                      textStyle: const TextStyle(fontSize: 18, color: Colors.white),
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
                          backgroundColor: const Color(0xFF2E1C6A),
                          child: Text(
                            '${step.stepNumber}',
                            style: const TextStyle(
                              fontSize: 10,
                              fontWeight: FontWeight.bold,
                              color: Color(0xFFA78BFA),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                step.explanation,
                                style: const TextStyle(
                                  fontFamily: 'Nunito',
                                  fontSize: 13,
                                  color: Color(0xFFC7D2FE),
                                ),
                              ),
                              if (step.latex.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Math.tex(
                                  step.latex,
                                  textStyle: const TextStyle(fontSize: 14, color: Colors.white),
                                ),
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
                  color: const Color(0x3310B981),
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
                      style: const TextStyle(
                        fontFamily: 'Nunito',
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF34D399),
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
                  backgroundColor: Colors.white.withOpacity(0.08),
                  side: BorderSide(color: Colors.white.withOpacity(0.14)),
                  avatar: const Icon(Icons.copy_rounded, size: 14, color: Color(0xFFA78BFA)),
                  label: const Text(
                    'Nusxalash',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 12,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  onPressed: () => _copySolution(msg),
                ),
                ActionChip(
                  backgroundColor: Colors.white.withOpacity(0.08),
                  side: BorderSide(color: Colors.white.withOpacity(0.14)),
                  avatar: const Icon(Icons.lightbulb_outline_rounded, size: 14, color: Color(0xFFFBBF24)),
                  label: const Text(
                    'Tushunmadim, soddaroq tushuntir',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 12,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  onPressed: () => _sendMessage(customText: 'Tushunmadim, soddaroq tushuntir', action: 'explain_more'),
                ),
                ActionChip(
                  backgroundColor: Colors.white.withOpacity(0.08),
                  side: BorderSide(color: Colors.white.withOpacity(0.14)),
                  avatar: const Icon(Icons.refresh_rounded, size: 14, color: Color(0xFF60A5FA)),
                  label: const Text(
                    'Yana bir misol ber',
                    style: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 12,
                      color: Colors.white,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  onPressed: () => _sendMessage(customText: 'Yana bir shunga o‘xshash misol ber', action: 'similar_example'),
                ),
                if (msg.suggestedActions != null)
                  ...msg.suggestedActions!.map((act) {
                    return ActionChip(
                      backgroundColor: Colors.white.withOpacity(0.08),
                      side: BorderSide(color: Colors.white.withOpacity(0.14)),
                      label: Text(
                        act,
                        style: const TextStyle(
                          fontFamily: 'Nunito',
                          fontSize: 12,
                          color: Color(0xFFC7D2FE),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
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
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: BoxDecoration(
          color: const Color(0xE017103B),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.12)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.25),
              blurRadius: 10,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 22,
              height: 22,
              margin: const EdgeInsets.only(right: 10),
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(6),
                boxShadow: [
                  BoxShadow(
                    color: const Color(0xFF7C3AED).withOpacity(0.35),
                    blurRadius: 4,
                  ),
                ],
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(6),
                child: Image.asset(
                  'assets/images/ai_ustoz_logo.png',
                  width: 22,
                  height: 22,
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const _BouncingDotsIndicator(color: Color(0xFFA78BFA)),
            const SizedBox(width: 10),
            const Text(
              'AI Ustoz yozmoqda...',
              style: TextStyle(
                fontFamily: 'Nunito',
                fontSize: 13,
                color: Color(0xFFC7D2FE),
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
        color: const Color(0xEB1A0D3D),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFFA78BFA).withOpacity(0.6)),
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
              children: const [
                Text(
                  'Galereyadan surat tanlandi',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'Savol yozing yoki darhol yechish uchun yuboring',
                  style: TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 11,
                    color: Color(0xFFC7D2FE),
                  ),
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
        color: const Color(0xF01A0614),
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFFEF4444), width: 1.5),
        boxShadow: const [
          BoxShadow(color: Color(0x33EF4444), blurRadius: 16, offset: Offset(0, 4)),
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
              style: const TextStyle(
                fontFamily: 'Nunito',
                fontWeight: FontWeight.w700,
                color: Color(0xFFEF4444),
                fontSize: 13,
              ),
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
            child: const Text('Bekor qilish', style: TextStyle(color: Color(0xFFC7D2FE), fontSize: 12)),
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
        color: const Color(0xF00D0726),
        border: Border(top: BorderSide(color: Colors.white.withOpacity(0.12), width: 1.0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.35),
            blurRadius: 16,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Row(
          children: [
            // Camera & Gallery image picker button
            _buildActionSquareButton(
              icon: Icons.add_a_photo_rounded,
              tooltip: 'Rasm yuklash (Kamera / Galereya)',
              colors: colors,
              onTap: (_isLoading || _isSending) ? null : _showImageSourceDialog,
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
                  color: Colors.white.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.14)),
                ),
                child: TextField(
                  controller: _textController,
                  enabled: !_isLoading && !_isSending,
                  style: const TextStyle(
                    fontFamily: 'Nunito',
                    fontSize: 14,
                    color: Colors.white,
                    fontWeight: FontWeight.w500,
                  ),
                  onSubmitted: (_) {
                    if (!_isLoading && !_isSending) _sendMessage();
                  },
                  decoration: InputDecoration(
                    hintText: (_isLoading || _isSending)
                        ? 'Ustoz javob bermoqda...'
                        : 'Savol, misol yoki tenglamani yozing...',
                    hintStyle: TextStyle(
                      fontFamily: 'Nunito',
                      fontSize: 13,
                      color: Colors.white.withOpacity(0.40),
                    ),
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
        ? (isDisabled ? const Color(0xFF7C3AED).withOpacity(0.35) : const Color(0xFF7C3AED))
        : (isDisabled ? Colors.white.withOpacity(0.04) : Colors.white.withOpacity(0.09));

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
                  ? (isDisabled ? const Color(0xFF8B5CF6).withOpacity(0.3) : const Color(0xFFA78BFA))
                  : Colors.white.withOpacity(0.14),
            ),
            boxShadow: isPrimary && !isDisabled
                ? [
                    BoxShadow(
                      color: const Color(0xFF7C3AED).withOpacity(0.4),
                      blurRadius: 10,
                      offset: const Offset(0, 2),
                    ),
                  ]
                : null,
          ),
          child: Icon(
            icon,
            size: 20,
            color: isPrimary
                ? Colors.white
                : (isDisabled ? Colors.white24 : const Color(0xFFDDD6FE)),
          ),
        ),
      ),
    );
  }
}

class _GlassActionButton extends StatefulWidget {
  final Widget child;
  final VoidCallback? onTap;
  final String? tooltip;

  const _GlassActionButton({
    required this.child,
    this.onTap,
    this.tooltip,
  });

  @override
  State<_GlassActionButton> createState() => _GlassActionButtonState();
}

class _GlassActionButtonState extends State<_GlassActionButton> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    Widget content = GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) => setState(() => _pressed = false),
      onTapCancel: () => setState(() => _pressed = false),
      onTap: widget.onTap,
      child: AnimatedScale(
        scale: _pressed ? 0.90 : 1.0,
        duration: const Duration(milliseconds: 120),
        curve: Curves.easeOutCubic,
        child: Container(
          width: 38,
          height: 38,
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.08),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.white.withOpacity(0.14), width: 1),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.15),
                blurRadius: 6,
                offset: const Offset(0, 2),
              ),
            ],
          ),
          child: Center(child: widget.child),
        ),
      ),
    );

    if (widget.tooltip != null) {
      return Tooltip(message: widget.tooltip!, child: content);
    }
    return content;
  }
}

class _AIUstozHeroLogo extends StatelessWidget {
  final Animation<double> animation;
  final bool disableAnim;

  const _AIUstozHeroLogo({
    required this.animation,
    required this.disableAnim,
  });

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: animation,
      builder: (context, child) {
        final val = disableAnim ? 0.0 : animation.value;
        final breathCycle = (val * 3.5) % 1.0;
        final scale = disableAnim ? 1.0 : (1.0 + math.sin(breathCycle * math.pi * 2) * 0.035);
        final floatY = disableAnim ? 0.0 : (math.sin(breathCycle * math.pi * 2) * 6.0);

        return RepaintBoundary(
          child: SizedBox(
            width: 220,
            height: 200,
            child: Stack(
              alignment: Alignment.center,
              clipBehavior: Clip.none,
              children: [
                // Soft glowing halo behind the logo
                Transform.translate(
                  offset: Offset(0, floatY),
                  child: Container(
                    width: 170,
                    height: 170,
                    decoration: const BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: RadialGradient(
                        colors: [
                          Color(0x757C3AED), // bright violet glow
                          Color(0x352563EB), // soft blue glow
                          Colors.transparent,
                        ],
                        stops: [0.0, 0.55, 1.0],
                      ),
                    ),
                  ),
                ),

                // 4 Orbiting twinkling stars
                ...List.generate(4, (index) {
                  final double baseAngle = (val * 2 * math.pi) + (index * math.pi / 2);
                  const double orbitRadius = 78.0;
                  final double ox = math.cos(baseAngle) * orbitRadius;
                  final double oy = math.sin(baseAngle) * orbitRadius + floatY;

                  final starData = [
                    (Icons.auto_awesome, const Color(0xFFFBBF24), 18.0), // Gold
                    (Icons.star_rounded, const Color(0xFF60A5FA), 14.0), // Electric Blue
                    (Icons.auto_awesome, Colors.white, 16.0),            // Crisp White
                    (Icons.star_rounded, const Color(0xFFF59E0B), 12.0), // Amber
                  ][index];

                  return Transform.translate(
                    offset: Offset(ox, oy),
                    child: Icon(
                      starData.$1,
                      color: starData.$2,
                      size: starData.$3,
                    ),
                  );
                }),

                // Central AI Ustoz Logo (120x120) with smooth breathing & float
                Transform.translate(
                  offset: Offset(0, floatY),
                  child: Transform.scale(
                    scale: scale,
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        borderRadius: BorderRadius.circular(32),
                        boxShadow: [
                          BoxShadow(
                            color: const Color(0xFF6D28D9).withOpacity(0.45),
                            blurRadius: 28,
                            spreadRadius: 2,
                            offset: const Offset(0, 8),
                          ),
                        ],
                      ),
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(32),
                        child: Image.asset(
                          'assets/images/ai_ustoz_logo.png',
                          width: 120,
                          height: 120,
                          fit: BoxFit.contain,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}

class _CosmicStar {
  final double x;
  final double y;
  final double size;
  final double twinkleSpeed;
  final double phase;
  final bool isSparkle;
  final bool isGold;

  const _CosmicStar({
    required this.x,
    required this.y,
    required this.size,
    required this.twinkleSpeed,
    required this.phase,
    required this.isSparkle,
    required this.isGold,
  });
}

class _CosmicCoin {
  final double x;
  final double initialY;
  final double speed;
  final double size;
  final double flipSpeed;
  final double phase;
  final double opacity;

  const _CosmicCoin({
    required this.x,
    required this.initialY,
    required this.speed,
    required this.size,
    required this.flipSpeed,
    required this.phase,
    required this.opacity,
  });
}

class CosmicBackgroundPainter extends CustomPainter {
  final double progress;
  final bool hasMessages;

  CosmicBackgroundPainter({
    required this.progress,
    required this.hasMessages,
  });

  static const List<_CosmicStar> _stars = [
    _CosmicStar(x: 0.12, y: 0.08, size: 3.5, twinkleSpeed: 2.2, phase: 0.0, isSparkle: true, isGold: true),
    _CosmicStar(x: 0.85, y: 0.12, size: 4.2, twinkleSpeed: 1.8, phase: 1.2, isSparkle: true, isGold: false),
    _CosmicStar(x: 0.28, y: 0.19, size: 2.0, twinkleSpeed: 3.1, phase: 2.4, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.72, y: 0.24, size: 3.8, twinkleSpeed: 2.5, phase: 0.7, isSparkle: true, isGold: true),
    _CosmicStar(x: 0.06, y: 0.32, size: 2.2, twinkleSpeed: 1.9, phase: 3.1, isSparkle: false, isGold: true),
    _CosmicStar(x: 0.92, y: 0.36, size: 3.0, twinkleSpeed: 2.8, phase: 1.9, isSparkle: true, isGold: false),
    _CosmicStar(x: 0.44, y: 0.14, size: 1.8, twinkleSpeed: 3.4, phase: 0.3, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.61, y: 0.42, size: 2.4, twinkleSpeed: 2.1, phase: 2.8, isSparkle: false, isGold: true),
    _CosmicStar(x: 0.18, y: 0.48, size: 4.0, twinkleSpeed: 1.7, phase: 1.5, isSparkle: true, isGold: false),
    _CosmicStar(x: 0.79, y: 0.52, size: 2.0, twinkleSpeed: 3.2, phase: 0.9, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.35, y: 0.58, size: 3.4, twinkleSpeed: 2.6, phase: 2.1, isSparkle: true, isGold: true),
    _CosmicStar(x: 0.90, y: 0.63, size: 2.2, twinkleSpeed: 1.6, phase: 3.5, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.08, y: 0.69, size: 3.6, twinkleSpeed: 2.3, phase: 0.4, isSparkle: true, isGold: true),
    _CosmicStar(x: 0.53, y: 0.67, size: 1.9, twinkleSpeed: 3.0, phase: 1.8, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.25, y: 0.76, size: 2.5, twinkleSpeed: 2.4, phase: 2.9, isSparkle: false, isGold: true),
    _CosmicStar(x: 0.82, y: 0.79, size: 3.8, twinkleSpeed: 1.9, phase: 0.6, isSparkle: true, isGold: false),
    _CosmicStar(x: 0.40, y: 0.83, size: 2.1, twinkleSpeed: 3.3, phase: 1.3, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.68, y: 0.88, size: 3.2, twinkleSpeed: 2.0, phase: 2.6, isSparkle: true, isGold: true),
    _CosmicStar(x: 0.14, y: 0.91, size: 2.2, twinkleSpeed: 2.7, phase: 0.8, isSparkle: false, isGold: true),
    _CosmicStar(x: 0.94, y: 0.93, size: 3.5, twinkleSpeed: 2.2, phase: 1.7, isSparkle: true, isGold: false),
    _CosmicStar(x: 0.48, y: 0.96, size: 1.8, twinkleSpeed: 3.5, phase: 3.2, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.31, y: 0.05, size: 2.2, twinkleSpeed: 2.5, phase: 0.2, isSparkle: false, isGold: true),
    _CosmicStar(x: 0.65, y: 0.09, size: 3.0, twinkleSpeed: 2.9, phase: 1.6, isSparkle: true, isGold: true),
    _CosmicStar(x: 0.04, y: 0.16, size: 1.7, twinkleSpeed: 3.6, phase: 2.5, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.96, y: 0.21, size: 3.2, twinkleSpeed: 1.8, phase: 0.5, isSparkle: true, isGold: false),
    _CosmicStar(x: 0.50, y: 0.29, size: 2.0, twinkleSpeed: 2.3, phase: 1.1, isSparkle: false, isGold: true),
    _CosmicStar(x: 0.22, y: 0.39, size: 3.1, twinkleSpeed: 2.7, phase: 2.7, isSparkle: true, isGold: true),
    _CosmicStar(x: 0.76, y: 0.45, size: 1.9, twinkleSpeed: 3.1, phase: 0.1, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.38, y: 0.47, size: 2.6, twinkleSpeed: 2.0, phase: 3.3, isSparkle: false, isGold: true),
    _CosmicStar(x: 0.60, y: 0.55, size: 3.3, twinkleSpeed: 2.4, phase: 1.4, isSparkle: true, isGold: false),
    _CosmicStar(x: 0.10, y: 0.59, size: 1.8, twinkleSpeed: 3.4, phase: 2.0, isSparkle: false, isGold: false),
    _CosmicStar(x: 0.86, y: 0.71, size: 3.0, twinkleSpeed: 2.1, phase: 0.8, isSparkle: true, isGold: true),
  ];

  static const List<_CosmicCoin> _coins = [
    _CosmicCoin(x: 0.08, initialY: 0.04, speed: 0.20, size: 22.0, flipSpeed: 1.4, phase: 0.3, opacity: 0.65),
    _CosmicCoin(x: 0.88, initialY: 0.14, speed: 0.17, size: 26.0, flipSpeed: 1.8, phase: 1.7, opacity: 0.75),
    _CosmicCoin(x: 0.22, initialY: 0.28, speed: 0.24, size: 18.0, flipSpeed: 2.1, phase: 2.8, opacity: 0.45),
    _CosmicCoin(x: 0.75, initialY: 0.38, speed: 0.19, size: 24.0, flipSpeed: 1.6, phase: 0.9, opacity: 0.70),
    _CosmicCoin(x: 0.14, initialY: 0.52, speed: 0.23, size: 20.0, flipSpeed: 1.9, phase: 3.2, opacity: 0.50),
    _CosmicCoin(x: 0.82, initialY: 0.62, speed: 0.16, size: 28.0, flipSpeed: 1.3, phase: 1.4, opacity: 0.80),
    _CosmicCoin(x: 0.30, initialY: 0.72, speed: 0.21, size: 22.0, flipSpeed: 2.0, phase: 2.2, opacity: 0.55),
    _CosmicCoin(x: 0.66, initialY: 0.82, speed: 0.22, size: 19.0, flipSpeed: 1.7, phase: 0.5, opacity: 0.48),
    _CosmicCoin(x: 0.06, initialY: 0.90, speed: 0.18, size: 25.0, flipSpeed: 1.5, phase: 1.9, opacity: 0.68),
    _CosmicCoin(x: 0.93, initialY: 0.46, speed: 0.25, size: 17.0, flipSpeed: 2.2, phase: 3.0, opacity: 0.42),
  ];

  @override
  void paint(Canvas canvas, Size size) {
    final globalAlpha = hasMessages ? 0.40 : 1.0;

    // 1. Deep Celestial Gradient (matching AI Ustoz Logo)
    final bgRect = Offset.zero & size;
    final bgPaint = Paint()
      ..shader = ui.Gradient.linear(
        Offset.zero,
        Offset(0, size.height),
        const [
          Color(0xFF0F0A2A), // Deep indigo night sky
          Color(0xFF1E104A), // Rich royal violet
          Color(0xFF121B4C), // Midnight cosmic blue
          Color(0xFF090D24), // Deep space footer
        ],
        const [0.0, 0.38, 0.75, 1.0],
      );
    canvas.drawRect(bgRect, bgPaint);

    // 2. Soft Aurora Glows (gentle Lissajous drifting)
    final aurora1Center = Offset(
      size.width * (0.35 + 0.15 * math.sin(progress * 2 * math.pi * 0.5)),
      size.height * (0.25 + 0.08 * math.cos(progress * 2 * math.pi * 0.7)),
    );
    final aurora1Paint = Paint()
      ..shader = ui.Gradient.radial(
        aurora1Center,
        size.width * 0.55,
        const [
          Color(0x357C3AED), // bright violet
          Color(0x153B82F6), // soft electric blue
          Colors.transparent,
        ],
        const [0.0, 0.5, 1.0],
      );
    canvas.drawCircle(aurora1Center, size.width * 0.55, aurora1Paint);

    final aurora2Center = Offset(
      size.width * (0.70 + 0.12 * math.cos(progress * 2 * math.pi * 0.6)),
      size.height * (0.65 + 0.10 * math.sin(progress * 2 * math.pi * 0.4)),
    );
    final aurora2Paint = Paint()
      ..shader = ui.Gradient.radial(
        aurora2Center,
        size.width * 0.50,
        const [
          Color(0x280284C7), // electric cyan
          Color(0x146D28D9), // purple
          Colors.transparent,
        ],
        const [0.0, 0.5, 1.0],
      );
    canvas.drawCircle(aurora2Center, size.width * 0.50, aurora2Paint);

    // 3. 25-35 Stars (Sparkles and round dots with varying twinkle)
    for (final star in _stars) {
      final sx = star.x * size.width;
      final sy = star.y * size.height;
      final wave = math.sin((progress * 2 * math.pi * star.twinkleSpeed) + star.phase).abs();
      final alpha = (0.30 + 0.70 * wave).clamp(0.0, 1.0) * globalAlpha;

      final color = star.isGold
          ? Color.fromRGBO(251, 191, 36, alpha)
          : Color.fromRGBO(255, 255, 255, alpha);

      final starPaint = Paint()..color = color;

      if (star.isSparkle) {
        _drawSparkle(canvas, Offset(sx, sy), star.size * (0.85 + 0.3 * wave), starPaint);
      } else {
        canvas.drawCircle(Offset(sx, sy), (star.size / 2) * (0.8 + 0.3 * wave), starPaint);
      }
    }

    // 4. Shooting Star across upper sky
    final shootCycle = (progress * 2.6) % 1.0;
    if (shootCycle < 0.25) {
      final t = shootCycle / 0.25;
      final startX = size.width * 0.82;
      final startY = size.height * 0.08;
      final endX = size.width * 0.14;
      final endY = size.height * 0.36;

      final currX = startX + (endX - startX) * t;
      final currY = startY + (endY - startY) * t;
      const tailLen = 65.0;
      final dx = (endX - startX);
      final dy = (endY - startY);
      final len = math.sqrt(dx * dx + dy * dy);
      final ux = dx / len;
      final uy = dy / len;

      final tailX = currX - ux * tailLen * (1.0 - t * 0.25);
      final tailY = currY - uy * tailLen * (1.0 - t * 0.25);

      final streakPaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(tailX, tailY),
          Offset(currX, currY),
          [
            Colors.transparent,
            const Color(0x60FBBF24),
            Colors.white.withOpacity(0.9 * globalAlpha),
          ],
          const [0.0, 0.5, 1.0],
        )
        ..strokeWidth = 2.0
        ..style = PaintingStyle.stroke;

      canvas.drawLine(Offset(tailX, tailY), Offset(currX, currY), streakPaint);
      canvas.drawCircle(Offset(currX, currY), 2.5, Paint()..color = Colors.white.withOpacity(globalAlpha));
    }

    // 5. 8-12 Gold Coins (Gently drifting downwards with 3D horizontal flip)
    for (final coin in _coins) {
      final coinX = coin.x * size.width;
      final coinY = ((coin.initialY + progress * coin.speed * 4) % 1.0) * size.height;

      // 3D flip factor scaleX (-1.0 to 1.0)
      final flip = math.cos((progress * 2 * math.pi * coin.flipSpeed) + coin.phase);
      final widthFactor = flip.abs().clamp(0.08, 1.0);
      final isBack = flip < 0;

      canvas.save();
      canvas.translate(coinX, coinY);
      canvas.rotate(0.12 * math.sin(progress * 2 * math.pi + coin.phase));

      final r = coin.size / 2;
      final w = r * widthFactor;
      final h = r;

      // Outer rim
      final rimRect = Rect.fromCenter(center: Offset.zero, width: w * 2, height: h * 2);
      final coinPaint = Paint()
        ..shader = ui.Gradient.linear(
          Offset(-w, -h),
          Offset(w, h),
          isBack
              ? const [Color(0xFFD97706), Color(0xFFFBBF24), Color(0xFF92400E)]
              : const [Color(0xFFFFFBEB), Color(0xFFFBBF24), Color(0xFFD97706)],
          const [0.0, 0.5, 1.0],
        )
        ..color = Colors.white.withOpacity(coin.opacity * globalAlpha);

      canvas.drawOval(rimRect, coinPaint);

      // Inner face
      if (w > 5) {
        final innerRect = Rect.fromCenter(center: Offset.zero, width: (w - 2.2) * 2, height: (h - 2.2) * 2);
        final innerPaint = Paint()
          ..shader = ui.Gradient.linear(
            Offset(-w, -h),
            Offset(w, h),
            const [Color(0xFFF59E0B), Color(0xFFB45309)],
          )
          ..color = Colors.white.withOpacity(coin.opacity * globalAlpha);
        canvas.drawOval(innerRect, innerPaint);

        // Center engraved Star
        if (w > 8) {
          final insigniaPaint = Paint()
            ..color = const Color(0xFFFFFBEB).withOpacity(0.9 * coin.opacity * globalAlpha);
          _drawEmbossedStar(canvas, Offset.zero, (w * 0.42).clamp(2.0, 7.0), insigniaPaint);
        }
      }

      canvas.restore();
    }
  }

  void _drawSparkle(Canvas canvas, Offset center, double size, Paint paint) {
    final path = Path();
    final half = size / 2;
    path.moveTo(center.dx, center.dy - half);
    path.quadraticBezierTo(center.dx, center.dy, center.dx + half, center.dy);
    path.quadraticBezierTo(center.dx, center.dy, center.dx, center.dy + half);
    path.quadraticBezierTo(center.dx, center.dy, center.dx - half, center.dy);
    path.quadraticBezierTo(center.dx, center.dy, center.dx, center.dy - half);
    path.close();
    canvas.drawPath(path, paint);
  }

  void _drawEmbossedStar(Canvas canvas, Offset center, double radius, Paint paint) {
    final path = Path();
    for (int i = 0; i < 5; i++) {
      final double outerAngle = -math.pi / 2 + i * 2 * math.pi / 5;
      final double innerAngle = outerAngle + math.pi / 5;
      final double ox = center.dx + radius * math.cos(outerAngle);
      final double oy = center.dy + radius * math.sin(outerAngle);
      final double ix = center.dx + (radius * 0.45) * math.cos(innerAngle);
      final double iy = center.dy + (radius * 0.45) * math.sin(innerAngle);
      if (i == 0) {
        path.moveTo(ox, oy);
      } else {
        path.lineTo(ox, oy);
      }
      path.lineTo(ix, iy);
    }
    path.close();
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CosmicBackgroundPainter oldDelegate) {
    return oldDelegate.progress != progress || oldDelegate.hasMessages != hasMessages;
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
    return RepaintBoundary(
      child: AnimatedBuilder(
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
    ),
  );
  }
}
