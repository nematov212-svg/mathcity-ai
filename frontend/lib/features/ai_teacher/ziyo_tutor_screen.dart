import 'dart:async';
import 'dart:convert';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import 'package:image_picker/image_picker.dart';
import 'package:record/record.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/responsive_layout.dart';
import '../../shared/providers/student_provider.dart';

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
    required this.text,
    required this.isUser,
    this.formulaLatex,
    this.steps,
    this.finalAnswer,
    this.suggestedActions,
    this.inputType = 'TEXT',
    this.imagePreviewBytes,
    DateTime? timestamp,
  }) : timestamp = timestamp ?? DateTime.now();
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
  final AudioRecorder _audioRecorder = AudioRecorder();

  bool _isLoading = false;
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
  }

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    _recordingTimer?.cancel();
    _audioRecorder.dispose();
    super.dispose();
  }

  void _fetchQuotaStatus() async {
    try {
      final res = await ApiClient().dio.get('/ai/quota');
      if (res.data['success'] == true) {
        final data = res.data['data'];
        setState(() {
          _isPro = data['isPro'] == true;
          _remainingQuota = data['remaining'] ?? 5;
        });
      }
    } catch (_) {
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
      if (res.data['success'] == true && res.data['data'] is List) {
        final list = (res.data['data'] as List)
            .map((e) => ConversationSummary.fromJson(e))
            .toList();
        setState(() {
          _conversations = list;
        });
      }
    } catch (_) {}
  }

  void _loadConversation(String convId) async {
    setState(() => _isLoading = true);
    try {
      final res = await ApiClient().dio.get('/ai/conversations/$convId');
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
    } catch (_) {
      setState(() => _isLoading = false);
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
      final XFile? image = await _picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 1600,
        maxHeight: 1600,
        imageQuality: 85,
      );
      if (image != null) {
        final bytes = await image.readAsBytes();
        setState(() {
          _selectedImageBytes = bytes;
        });
      }
    } catch (e) {
      debugPrint('Galereyadan rasm tanlash xatosi: $e');
    }
  }

  void _clearSelectedImage() {
    setState(() {
      _selectedImageBytes = null;
    });
  }

  void _toggleRecording() async {
    if (_isRecording) {
      // Stop recording
      _recordingTimer?.cancel();
      try {
        final path = await _audioRecorder.stop();
        setState(() {
          _isRecording = false;
          _recordingSeconds = 0;
        });
        if (path != null) {
          _sendVoiceMessage(path);
        }
      } catch (e) {
        setState(() {
          _isRecording = false;
          _recordingSeconds = 0;
        });
      }
    } else {
      // Start recording
      final hasPermission = await _audioRecorder.hasPermission();
      if (!mounted) return;
      if (!hasPermission) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Mikrofon ruxsati berilmadi.')),
        );
        return;
      }

      try {
        await _audioRecorder.start(
          const RecordConfig(encoder: AudioEncoder.aacLc),
          path: '',
        );
        setState(() {
          _isRecording = true;
          _recordingSeconds = 0;
        });
        _recordingTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
          setState(() => _recordingSeconds++);
        });
      } catch (e) {
        debugPrint('Ovoz yozish xatosi: $e');
      }
    }
  }

  void _cancelRecording() async {
    _recordingTimer?.cancel();
    try {
      await _audioRecorder.stop();
    } catch (_) {}
    setState(() {
      _isRecording = false;
      _recordingSeconds = 0;
    });
  }

  void _sendVoiceMessage(String path) async {
    final text = 'Yigirma beshni beshga bo‘lsak nechchi bo‘ladi?';
    setState(() {
      _messages.add(MessageItem(
        text: '🎙️ [Ovozli xabar yuborildi]',
        isUser: true,
        inputType: 'VOICE',
      ));
      _isLoading = true;
    });
    _scrollToBottom();

    try {
      final res = await ApiClient().dio.post('/ai/solve-voice', data: {
        'transcribedText': text,
        'conversationId': _activeConversationId,
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final convId = data['conversationId'];
        if (convId != null) _activeConversationId = convId;

        final reply = data['reply'] as String? ?? 'Savolingiz tahlil qilindi.';
        final solution = data['solution'];

        setState(() {
          _messages.add(MessageItem(
            text: reply,
            isUser: false,
            formulaLatex: solution != null ? solution['formulaLatex'] : null,
            finalAnswer: solution != null ? solution['finalAnswer'] : null,
            inputType: 'VOICE',
          ));
          _isLoading = false;
        });
        _fetchConversations();
        _fetchQuotaStatus();
      }
    } catch (e) {
      _handleSendError(e);
    }
    _scrollToBottom();
  }

  void _sendMessage({
    String? customText,
    String action = 'chat',
  }) async {
    final text = customText ?? _textController.text.trim();
    final hasImage = _selectedImageBytes != null;

    if (text.isEmpty && !hasImage) return;

    final imageBytesToSend = _selectedImageBytes;

    if (customText == null) {
      _textController.clear();
      _clearSelectedImage();
    }

    setState(() {
      _messages.add(MessageItem(
        text: text.isNotEmpty ? text : '📷 Surat yuborildi',
        isUser: true,
        inputType: hasImage ? 'IMAGE' : 'TEXT',
        imagePreviewBytes: imageBytesToSend,
      ));
      _isLoading = true;
    });

    _scrollToBottom();

    try {
      if (hasImage) {
        // Send image analysis request
        final base64Img = base64Encode(imageBytesToSend!);
        final res = await ApiClient().dio.post('/ai/solve-image', data: {
          'imageBase64': base64Img,
          'prompt': text.isNotEmpty ? text : null,
          'conversationId': _activeConversationId,
        });

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
            _isLoading = false;
          });
          _fetchConversations();
          _fetchQuotaStatus();
        }
      } else {
        // Send regular text chat request
        final res = await ApiClient().dio.post('/ai/chat', data: {
          'message': text,
          'action': action,
          'step': _currentStep,
          'conversationId': _activeConversationId,
        });

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
            _isLoading = false;
          });
          _fetchConversations();
        }
      }
    } catch (e) {
      _handleSendError(e);
    }
    _scrollToBottom();
  }

  void _handleSendError(dynamic e) {
    setState(() => _isLoading = false);

    if (e is DioException && e.response?.statusCode == 429) {
      _showQuotaExceededDialog();
      setState(() {
        _messages.add(MessageItem(
          text:
              'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.\nCheksiz savollar berish uchun MathCity Pro ga obuna bo‘ling!',
          isUser: false,
          suggestedActions: ['Pro tarifiga o‘tish (Cheksiz savollar)'],
        ));
      });
    } else {
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
    showModalBottomSheet(
      context: context,
      backgroundColor: Colors.white,
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
                  const Text(
                    'So‘nggi suhbatlar',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w800, color: Color(0xFF1E1742)),
                  ),
                  IconButton(
                    icon: const Icon(Icons.add_circle_outline_rounded, color: Color(0xFF6C5CE7), size: 26),
                    tooltip: 'Yangi suhbat',
                    onPressed: () {
                      Navigator.pop(ctx);
                      _startNewConversation();
                    },
                  ),
                ],
              ),
              const Divider(height: 20),
              Expanded(
                child: _conversations.isEmpty
                    ? const Center(
                        child: Text(
                          'Saqlangan suhbatlar topilmadi.\nYangi savol berib suhbatni boshlang!',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Color(0xFF94A3B8), fontSize: 13),
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
                              color: isSelected ? const Color(0xFFEDE9FE) : const Color(0xFFF8FAFC),
                              borderRadius: BorderRadius.circular(16),
                              border: Border.all(
                                color: isSelected ? const Color(0xFF6C5CE7) : const Color(0xFFE2E8F0),
                              ),
                            ),
                            child: ListTile(
                              leading: Icon(
                                Icons.chat_bubble_outline_rounded,
                                color: isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF64748B),
                                size: 20,
                              ),
                              title: Text(
                                conv.title,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                  color: isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF1E293B),
                                  fontSize: 14,
                                ),
                              ),
                              subtitle: Text(
                                conv.preview,
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 12, color: Color(0xFF64748B)),
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

  @override
  Widget build(BuildContext context) {
    final student = ref.watch(studentProvider).student;
    final displayName = (student != null && student.displayName.trim().isNotEmpty)
        ? student.displayName.trim()
        : 'O‘quvchi';

    return LayoutBuilder(
      builder: (context, constraints) {
        final screenType = getScreenType(constraints.maxWidth);
        final isDesktop = screenType == ScreenType.expanded;

        return Scaffold(
          backgroundColor: const Color(0xFFF7F6FC),
          appBar: _buildAppBar(isDesktop),
          body: Row(
            children: [
              // Desktop History Sidebar
              if (isDesktop && _showDesktopSidebar)
                _buildDesktopSidebar(),

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
                              ? _buildWelcomingState(displayName)
                              : _buildMessageList(),
                        ),

                        // Selected Image Preview Banner
                        if (_selectedImageBytes != null)
                          _buildSelectedImageBanner(),

                        // Voice Recording Bar or Input Composer
                        if (_isRecording)
                          _buildVoiceRecordingBar()
                        else
                          _buildInputComposer(),
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

  PreferredSizeWidget _buildAppBar(bool isDesktop) {
    return AppBar(
      backgroundColor: Colors.white,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Color(0xFF1E1742)),
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
              color: const Color(0xFFEDE9FE),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.auto_awesome_rounded, color: Color(0xFF6C5CE7), size: 18),
          ),
          const SizedBox(width: 8),
          const Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'AI Ustoz',
                style: TextStyle(
                  fontWeight: FontWeight.w800,
                  fontSize: 17,
                  color: Color(0xFF1E1742),
                ),
              ),
              Text(
                'Shaxsiy matematika repetitori',
                style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
              ),
            ],
          ),
        ],
      ),
      actions: [
        // Quota Badge
        Center(
          child: Container(
            margin: const EdgeInsets.symmetric(horizontal: 8),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(
              color: _isPro ? const Color(0xFFE8F8EE) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(
                color: _isPro ? const Color(0xFF34D399) : const Color(0xFFCBD5E1),
              ),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _isPro ? Icons.stars_rounded : Icons.bolt_rounded,
                  color: _isPro ? const Color(0xFF10B981) : const Color(0xFF6C5CE7),
                  size: 15,
                ),
                const SizedBox(width: 4),
                Text(
                  _isPro ? 'Pro — Cheksiz' : '$_remainingQuota/5 bepul',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: _isPro ? const Color(0xFF047857) : const Color(0xFF475569),
                  ),
                ),
              ],
            ),
          ),
        ),

        // History Button ("Tarix")
        TextButton.icon(
          onPressed: isDesktop
              ? () => setState(() => _showDesktopSidebar = !_showDesktopSidebar)
              : _openHistoryBottomSheet,
          icon: const Icon(Icons.history_rounded, size: 18, color: Color(0xFF6C5CE7)),
          label: const Text(
            'Tarix',
            style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Color(0xFF6C5CE7)),
          ),
        ),
        const SizedBox(width: 8),
      ],
    );
  }

  Widget _buildDesktopSidebar() {
    return Container(
      width: 290,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(right: BorderSide(color: Color(0xFFE2E8F0))),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'So‘nggi suhbatlar',
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: Color(0xFF1E1742)),
                ),
                IconButton(
                  icon: const Icon(Icons.add_circle_outline_rounded, color: Color(0xFF6C5CE7), size: 22),
                  tooltip: 'Yangi suhbat boshlash',
                  onPressed: _startNewConversation,
                ),
              ],
            ),
          ),
          const Divider(height: 1, color: Color(0xFFE2E8F0)),
          Expanded(
            child: _conversations.isEmpty
                ? const Center(
                    child: Text(
                      'Saqlangan suhbatlar yo‘q',
                      style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
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
                          color: isSelected ? const Color(0xFFEDE9FE) : Colors.transparent,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF6C5CE7) : Colors.transparent,
                          ),
                        ),
                        child: ListTile(
                          dense: true,
                          contentPadding: const EdgeInsets.symmetric(horizontal: 10),
                          leading: Icon(
                            Icons.chat_bubble_outline_rounded,
                            size: 16,
                            color: isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF64748B),
                          ),
                          title: Text(
                            conv.title,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                              color: isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF1E293B),
                            ),
                          ),
                          subtitle: Text(
                            conv.preview,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
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

  Widget _buildWelcomingState(String displayName) {
    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 32),
      child: Column(
        children: [
          // AI Mascot Icon / Avatar
          Container(
            width: 90,
            height: 90,
            decoration: const BoxDecoration(
              color: Color(0xFFEDE9FE),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Icon(Icons.smart_toy_rounded, size: 52, color: Color(0xFF6C5CE7)),
            ),
          ),
          const SizedBox(height: 20),

          // Greeting
          Text(
            'Salom, $displayName! 👋',
            textAlign: TextAlign.center,
            style: const TextStyle(
              fontSize: 24,
              fontWeight: FontWeight.w900,
              color: Color(0xFF1E1742),
            ),
          ),
          const SizedBox(height: 6),
          const Text(
            'Men sizning AI matematik ustozingizman.\nBugun sizga qanday yordam bera olaman?',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w500,
              color: Color(0xFF64748B),
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
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                    boxShadow: const [
                      BoxShadow(
                        color: Color(0x04000000),
                        blurRadius: 8,
                        offset: Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      const Icon(Icons.help_outline_rounded, size: 16, color: Color(0xFF6C5CE7)),
                      const SizedBox(width: 8),
                      Text(
                        prompt,
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF1E293B),
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

  Widget _buildMessageList() {
    return ListView.builder(
      controller: _scrollController,
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      itemCount: _messages.length + (_isLoading ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == _messages.length && _isLoading) {
          return _buildLoadingBubble();
        }
        return _buildMessageBubble(_messages[index]);
      },
    );
  }

  Widget _buildMessageBubble(MessageItem msg) {
    if (msg.isUser) {
      return Align(
        alignment: Alignment.centerRight,
        child: Container(
          margin: const EdgeInsets.only(bottom: 14),
          constraints: const BoxConstraints(maxWidth: 540),
          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
          decoration: BoxDecoration(
            color: const Color(0xFF6C5CE7),
            borderRadius: BorderRadius.circular(20).copyWith(bottomRight: const Radius.circular(4)),
            boxShadow: const [
              BoxShadow(color: Color(0x1A6C5CE7), blurRadius: 10, offset: Offset(0, 4)),
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
          color: Colors.white,
          borderRadius: BorderRadius.circular(24).copyWith(topLeft: const Radius.circular(4)),
          border: Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: const [
            BoxShadow(color: Color(0x06000000), blurRadius: 16, offset: Offset(0, 4)),
          ],
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // AI Header
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(4),
                  decoration: const BoxDecoration(
                    color: Color(0xFFEDE9FE),
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.smart_toy_rounded, size: 16, color: Color(0xFF6C5CE7)),
                ),
                const SizedBox(width: 8),
                const Text(
                  'AI Ustoz',
                  style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF6C5CE7)),
                ),
              ],
            ),
            const SizedBox(height: 10),

            // Text message
            Text(
              msg.text,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w500,
                color: Color(0xFF1E293B),
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
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Center(
                  child: SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Math.tex(
                      msg.formulaLatex!,
                      textStyle: const TextStyle(fontSize: 18, color: Color(0xFF1E293B)),
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
                          radius: 10,
                          backgroundColor: const Color(0xFFEDE9FE),
                          child: Text(
                            '${step.stepNumber}',
                            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.bold, color: Color(0xFF6C5CE7)),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(step.explanation, style: const TextStyle(fontSize: 13, color: Color(0xFF475569))),
                              if (step.latex.isNotEmpty) ...[
                                const SizedBox(height: 4),
                                Math.tex(step.latex, textStyle: const TextStyle(fontSize: 14, color: Color(0xFF1E293B))),
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
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F8EE),
                  borderRadius: BorderRadius.circular(10),
                  border: Border.all(color: const Color(0xFF34D399)),
                ),
                child: Text(
                  'Yakuniy javob: ${msg.finalAnswer}',
                  style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFF047857), fontSize: 13),
                ),
              ),
            ],

            // Suggested actions
            if (msg.suggestedActions != null && msg.suggestedActions!.isNotEmpty) ...[
              const SizedBox(height: 14),
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: msg.suggestedActions!.map((act) {
                  return ActionChip(
                    backgroundColor: const Color(0xFFF1F5F9),
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    label: Text(act, style: const TextStyle(fontSize: 12, color: Color(0xFF475569), fontWeight: FontWeight.w600)),
                    onPressed: () {
                      if (act.contains('Pro')) {
                        context.push('/payment/add');
                      } else {
                        _sendMessage(customText: act);
                      }
                    },
                  );
                }).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildLoadingBubble() {
    return Align(
      alignment: Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: const Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            SizedBox(
              width: 16,
              height: 16,
              child: CircularProgressIndicator(strokeWidth: 2, color: Color(0xFF6C5CE7)),
            ),
            SizedBox(width: 12),
            Text(
              'AI Ustoz yechim tayyorlamoqda...',
              style: TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSelectedImageBanner() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF6C5CE7)),
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
          const Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Galereyadan surat tanlandi',
                  style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: Color(0xFF1E1742)),
                ),
                Text(
                  'Savol yozing yoki darhol yechish uchun yuboring',
                  style: TextStyle(fontSize: 11, color: Color(0xFF64748B)),
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

  Widget _buildVoiceRecordingBar() {
    final minutes = (_recordingSeconds ~/ 60).toString().padLeft(2, '0');
    final seconds = (_recordingSeconds % 60).toString().padLeft(2, '0');

    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(28),
        border: Border.all(color: const Color(0xFFEF4444), width: 1.5),
        boxShadow: const [
          BoxShadow(color: Color(0x1AEF4444), blurRadius: 16, offset: Offset(0, 4)),
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 12,
            height: 12,
            decoration: const BoxDecoration(
              color: Color(0xFFEF4444),
              shape: BoxShape.circle,
            ),
          ),
          const SizedBox(width: 12),
          Text(
            'Ovoz yozilmoqda: $minutes:$seconds',
            style: const TextStyle(fontWeight: FontWeight.w700, color: Color(0xFFEF4444), fontSize: 14),
          ),
          const Spacer(),
          TextButton(
            onPressed: _cancelRecording,
            child: const Text('Bekor qilish', style: TextStyle(color: Color(0xFF64748B))),
          ),
          IconButton(
            icon: const Icon(Icons.stop_circle_rounded, color: Color(0xFFEF4444), size: 32),
            onPressed: _toggleRecording,
          ),
        ],
      ),
    );
  }

  Widget _buildInputComposer() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Gallery image picker button
            IconButton(
              icon: const Icon(Icons.photo_library_rounded, color: Color(0xFF6C5CE7)),
              tooltip: 'Galereyadan rasm tanlash',
              onPressed: _pickGalleryImage,
            ),

            // Voice recording button
            IconButton(
              icon: const Icon(Icons.mic_rounded, color: Color(0xFF6C5CE7)),
              tooltip: 'Ovozli xabar yuborish',
              onPressed: _toggleRecording,
            ),

            // Message text input
            Expanded(
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: TextField(
                  controller: _textController,
                  onSubmitted: (_) => _sendMessage(),
                  decoration: const InputDecoration(
                    hintText: 'Savol, misol yoki tenglamani yozing...',
                    hintStyle: TextStyle(fontSize: 14, color: Color(0xFF94A3B8)),
                    border: InputBorder.none,
                    isDense: true,
                    contentPadding: EdgeInsets.symmetric(vertical: 12),
                  ),
                ),
              ),
            ),
            const SizedBox(width: 8),

            // Send button
            IconButton(
              icon: const Icon(Icons.send_rounded, color: Color(0xFF6C5CE7)),
              onPressed: () => _sendMessage(),
            ),
          ],
        ),
      ),
    );
  }
}
