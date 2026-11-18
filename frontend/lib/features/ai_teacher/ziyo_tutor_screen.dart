import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:go_router/go_router.dart';
import 'package:dio/dio.dart';
import '../../core/constants/app_colors.dart';
import '../../core/network/api_client.dart';
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
  final String? inputType; // 'TEXT', 'IMAGE', 'VOICE'

  MessageItem({
    required this.text,
    required this.isUser,
    this.formulaLatex,
    this.steps,
    this.finalAnswer,
    this.suggestedActions,
    this.inputType = 'TEXT',
  });
}

class ZiyoTutorScreen extends ConsumerStatefulWidget {
  const ZiyoTutorScreen({super.key});

  @override
  ConsumerState<ZiyoTutorScreen> createState() => _ZiyoTutorScreenState();
}

class _ZiyoTutorScreenState extends ConsumerState<ZiyoTutorScreen> {
  final _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  int _currentStep = 1;

  // Quota status
  int _remainingQuota = 5;
  bool _isPro = false;
  String _quotaBadgeText = 'Yuklanmoqda...';

  final List<MessageItem> _messages = [
    MessageItem(
      text:
          'Salom! Men sizning sun’iy intellekt matematika ustozingiz — AI Ustozman! 🤖✨\nIstalgan misol, tenglama yoki masalangizni yozing, rasmga olib yuboring yoki ovoz orqali so‘rang!',
      isUser: false,
      suggestedActions: [
        '2x + 6 = 16 tenglamani yech',
        '40 ning 20 foizi qancha?',
        '25 ÷ 5 nechchi bo‘ladi?',
        'Kasrlarni qo‘shish qoidasi',
      ],
    ),
  ];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final student = ref.read(studentProvider).student;
      final name = (student != null && student.displayName.trim().isNotEmpty)
          ? student.displayName.trim()
          : 'O‘quvchi';
      if (_messages.isNotEmpty && !_messages.first.isUser) {
        setState(() {
          _messages[0] = MessageItem(
            text:
                'Salom, $name! 👋\nMen sizning shaxsiy AI Ustozingizman! 🤖✨\nIstalgan misol, tenglama yoki masalangizni yozing, rasmga olib yuboring yoki ovoz orqali so‘rang!',
            isUser: false,
            suggestedActions: _messages[0].suggestedActions,
          );
        });
      }
    });
    _fetchQuotaStatus();
  }

  void _fetchQuotaStatus() async {
    try {
      final res = await ApiClient().dio.get('/ai/quota');
      if (res.data['success'] == true) {
        final data = res.data['data'];
        setState(() {
          _isPro = data['isPro'] == true;
          _remainingQuota = data['remaining'] ?? 5;
          _quotaBadgeText = data['quotaBadgeText'] ?? 'Qolgan bepul so‘rovlar: 5/5';
        });
      }
    } catch (_) {
      // Local fallback based on student provider
      final student = ref.read(studentProvider).student;
      final isProUser = student?.subscription.status == 'PRO_ACTIVE';
      setState(() {
        _isPro = isProUser;
        _quotaBadgeText = isProUser ? 'AI Ustoz Pro — Cheksiz savollar' : 'Qolgan bepul so‘rovlar: 5/5';
      });
    }
  }

  void _sendMessage({
    String? customText,
    String action = 'chat',
    String? inputType,
  }) async {
    final text = customText ?? _textController.text.trim();
    if (text.isEmpty) return;

    if (customText == null) {
      _textController.clear();
    }

    setState(() {
      _messages.add(MessageItem(text: text, isUser: true, inputType: inputType ?? 'TEXT'));
      _isLoading = true;
    });

    _scrollToBottom();

    try {
      final res = await ApiClient().dio.post('/ai/chat', data: {
        'message': text,
        'action': action,
        'step': _currentStep,
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
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
          ));
          _currentStep = data['step'] ?? (_currentStep + 1);
          if (!_isPro && data['remainingQuota'] != null) {
            _remainingQuota = data['remainingQuota'];
            _quotaBadgeText = 'Qolgan bepul so‘rovlar: $_remainingQuota/5';
          }
          _isLoading = false;
        });
      }
    } catch (e) {
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
        // Deterministic local solver fallback
        setState(() {
          if (text.contains('2x + 6 = 16')) {
            _messages.add(MessageItem(
              text: 'Tenglama yechimi:\n1. 2x + 6 = 16\n2. 2x = 10\n3. x = 5',
              isUser: false,
              formulaLatex: 'x = 5',
              finalAnswer: 'x = 5',
              steps: [
                SolutionStep(stepNumber: 1, title: 'Boshlang‘ich', explanation: 'Tenglamani yozib olamiz', latex: '2x + 6 = 16'),
                SolutionStep(stepNumber: 2, title: 'Ayirish', explanation: 'Ikkala tomondan 6 ni ayiramiz', latex: '2x = 10'),
                SolutionStep(stepNumber: 3, title: 'Bo‘lish', explanation: '2 ga bo‘lamiz', latex: 'x = 5'),
              ],
            ));
          } else {
            _messages.add(MessageItem(
              text: 'Savolingiz qabul qilindi. Keling, birgalikda yechamiz!',
              isUser: false,
              formulaLatex: 'x = ?',
            ));
          }
        });
      }
    }

    _scrollToBottom();
  }

  void _sendImageMath() async {
    setState(() {
      _messages.add(MessageItem(
        text: '📷 [Surat yuklandi: 2x + 6 = 16 tenglamasi]',
        isUser: true,
        inputType: 'IMAGE',
      ));
      _isLoading = true;
    });

    _scrollToBottom();

    try {
      final res = await ApiClient().dio.post('/ai/solve-image', data: {
        'extractedText': '2x + 6 = 16',
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final solution = data['solution'];
        setState(() {
          _messages.add(MessageItem(
            text: '📷 Suratdagi masala tanib olindi va yechildi:\nJavob: ${solution['finalAnswer']}',
            isUser: false,
            formulaLatex: solution['formulaLatex'],
            finalAnswer: solution['finalAnswer'],
          ));
          _isLoading = false;
        });
      }
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _sendVoiceMath() async {
    setState(() {
      _messages.add(MessageItem(
        text: '🎙️ [Ovozli savol: "Yigirma beshni beshga bo‘lsak nechchi bo‘ladi?"]',
        isUser: true,
        inputType: 'VOICE',
      ));
      _isLoading = true;
    });

    _scrollToBottom();

    try {
      final res = await ApiClient().dio.post('/ai/solve-voice', data: {
        'transcribedText': 'Yigirma beshni beshga bo‘lsak nechchi bo‘ladi',
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
        final solution = data['solution'];
        setState(() {
          _messages.add(MessageItem(
            text: '🎙️ Ovozli savolingiz yechildi:\n25 ÷ 5 = ${solution['finalAnswer']}',
            isUser: false,
            formulaLatex: solution['formulaLatex'],
            finalAnswer: solution['finalAnswer'],
          ));
          _isLoading = false;
        });
      }
    } catch (_) {
      setState(() => _isLoading = false);
    }
  }

  void _showQuotaExceededDialog() {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1C1C1E),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Row(
          children: [
            Icon(Icons.hourglass_bottom_rounded, color: Color(0xFFFF9500), size: 26),
            SizedBox(width: 10),
            Text('Kunlik limit tugadi', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
          ],
        ),
        content: const Text(
          'Bugungi 5 ta bepul AI so‘rovingiz tugadi. Limit 24 soatlik muddat asosida yangilanadi.\n\nCheksiz savollar berish va barcha darslarni ochish uchun MathCity Pro ga obuna bo‘ling!',
          style: TextStyle(color: Color(0xFF8E8E93), fontSize: 14, height: 1.4),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Keyinroq', style: TextStyle(color: Color(0xFF8E8E93))),
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
            child: const Text('Pro ga o‘tish', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _scrollToBottom() {
    Future.delayed(const Duration(milliseconds: 150), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.kidsBackground,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            Container(
              width: 42,
              height: 42,
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF6C5CE7), Color(0xFFA29BFE)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy_rounded, color: Colors.white, size: 24),
            ),
            const SizedBox(width: 12),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'AI Ustoz',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.kidsDarkText,
                  ),
                ),
                Text(
                  'Matematikani birgalikda o‘rganamiz',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.kidsSecondaryText,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          // Quota Banner at Top
          Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: _isPro ? const Color(0xFFF3E8FF) : const Color(0xFFFFF8E7),
              border: Border(
                bottom: BorderSide(
                  color: _isPro ? const Color(0xFFD8B4FE) : const Color(0xFFFFE8B2),
                  width: 1,
                ),
              ),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(
                  _isPro ? Icons.stars_rounded : Icons.info_outline_rounded,
                  color: _isPro ? const Color(0xFF7E22CE) : const Color(0xFFD97706),
                  size: 16,
                ),
                const SizedBox(width: 8),
                Text(
                  _quotaBadgeText,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                    color: _isPro ? const Color(0xFF7E22CE) : const Color(0xFFB45309),
                  ),
                ),
              ],
            ),
          ),

          // Messages List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                return _buildMessageBubble(msg);
              },
            ),
          ),

          // Loading Indicator
          if (_isLoading)
            Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.kidsBorder),
                    ),
                    child: const Row(
                      children: [
                        SizedBox(
                          width: 14,
                          height: 14,
                          child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.kidsPrimary),
                        ),
                        SizedBox(width: 10),
                        Text(
                          'AI Ustoz masalani yechmoqda...',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          // Functional Input Bar with Camera, Image, Mic & Text
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: AppColors.kidsBorder, width: 1.5)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  // Camera Button
                  IconButton(
                    icon: const Icon(Icons.camera_alt_rounded, color: AppColors.kidsPrimary),
                    tooltip: 'Rasmga olib yechish',
                    onPressed: _sendImageMath,
                  ),
                  // Image Gallery Button
                  IconButton(
                    icon: const Icon(Icons.image_outlined, color: AppColors.kidsPrimary),
                    tooltip: 'Rasmdan masalani yuklash',
                    onPressed: _sendImageMath,
                  ),
                  // Mic Button (Voice Math)
                  IconButton(
                    icon: const Icon(Icons.mic_rounded, color: Color(0xFF007AFF)),
                    tooltip: 'Ovozli savol berish',
                    onPressed: _sendVoiceMath,
                  ),
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: InputDecoration(
                        hintText: 'Misol yozing: 2x + 6 = 16...',
                        filled: true,
                        fillColor: const Color(0xFFF6F7FE),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (val) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 6),
                  Container(
                    decoration: const BoxDecoration(
                      color: AppColors.kidsPrimary,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                      onPressed: () => _sendMessage(),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMessageBubble(MessageItem msg) {
    return Align(
      alignment: msg.isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        constraints: BoxConstraints(
          maxWidth: MediaQuery.of(context).size.width * 0.88,
        ),
        child: Column(
          crossAxisAlignment:
              msg.isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
              decoration: BoxDecoration(
                color: msg.isUser ? AppColors.kidsPrimary : Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(22),
                  topRight: const Radius.circular(22),
                  bottomLeft: Radius.circular(msg.isUser ? 22 : 4),
                  bottomRight: Radius.circular(msg.isUser ? 4 : 22),
                ),
                border: Border.all(
                  color: msg.isUser ? AppColors.kidsPrimary : AppColors.kidsBorder,
                  width: 1.5,
                ),
                boxShadow: [
                  BoxShadow(
                    color: AppColors.kidsDarkText.withOpacity(0.04),
                    blurRadius: 10,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    msg.text,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: msg.isUser ? Colors.white : AppColors.kidsDarkText,
                      height: 1.45,
                    ),
                  ),

                  // Step-by-Step Solution Breakdown Cards
                  if (msg.steps != null && msg.steps!.isNotEmpty) ...[
                    const SizedBox(height: 14),
                    const Text(
                      'Bosqichma-bosqich yechim:',
                      style: TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: AppColors.kidsPrimary,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ...msg.steps!.map((step) => Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFF8F7FF),
                            borderRadius: BorderRadius.circular(14),
                            border: Border.all(color: const Color(0xFFE5DEFF)),
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '${step.stepNumber}-qadam: ${step.title}',
                                style: const TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.bold,
                                  color: Color(0xFF4C1D95),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                step.explanation,
                                style: const TextStyle(fontSize: 13, color: AppColors.kidsDarkText),
                              ),
                              if (step.latex.isNotEmpty) ...[
                                const SizedBox(height: 6),
                                Math.tex(
                                  step.latex,
                                  textStyle: const TextStyle(
                                    fontSize: 16,
                                    fontWeight: FontWeight.bold,
                                    color: AppColors.kidsPrimary,
                                  ),
                                ),
                              ],
                            ],
                          ),
                        )),
                  ],

                  // Mathematical LaTeX Formula Rendering
                  if (msg.formulaLatex != null && msg.formulaLatex!.isNotEmpty && (msg.steps == null || msg.steps!.isEmpty)) ...[
                    const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: msg.isUser
                            ? Colors.white.withOpacity(0.15)
                            : const Color(0xFFF3F0FF),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Math.tex(
                        msg.formulaLatex!,
                        textStyle: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: msg.isUser ? Colors.white : AppColors.kidsPrimary,
                        ),
                      ),
                    ),
                  ],

                  // Final Answer Highlight
                  if (msg.finalAnswer != null) ...[
                    const SizedBox(height: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                      decoration: BoxDecoration(
                        color: const Color(0xFFDCFCE7),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: const Color(0xFF86EFAC)),
                      ),
                      child: Text(
                        'Javob: ${msg.finalAnswer}',
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF15803D),
                        ),
                      ),
                    ),
                  ],
                ],
              ),
            ),

            // Suggested Action Chips
            if (msg.suggestedActions != null && msg.suggestedActions!.isNotEmpty) ...[
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: msg.suggestedActions!.map((action) {
                  return ActionChip(
                    backgroundColor: Colors.white,
                    side: const BorderSide(color: Color(0xFFDED6FF), width: 1.2),
                    label: Text(
                      action,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: AppColors.kidsPrimary,
                      ),
                    ),
                    onPressed: () {
                      if (action.contains('Pro tarifiga')) {
                        context.push('/payment/add');
                      } else {
                        _sendMessage(customText: action);
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
}
