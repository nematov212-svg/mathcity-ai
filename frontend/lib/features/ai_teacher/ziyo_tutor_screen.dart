import 'package:flutter/material.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/network/api_client.dart';

class MessageItem {
  final String text;
  final bool isUser;
  final String? formulaLatex;
  final List<String>? suggestedActions;

  MessageItem({
    required this.text,
    required this.isUser,
    this.formulaLatex,
    this.suggestedActions,
  });
}

class ZiyoTutorScreen extends StatefulWidget {
  const ZiyoTutorScreen({super.key});

  @override
  State<ZiyoTutorScreen> createState() => _ZiyoTutorScreenState();
}

class _ZiyoTutorScreenState extends State<ZiyoTutorScreen> {
  final _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isLoading = false;
  int _currentStep = 1;

  final List<MessageItem> _messages = [
    MessageItem(
      text:
          'Salom! Men sizning sun’iy intellekt matematika ustozingiz Ziyoman! 🤖✨\nQaysi dars yoki masalani birgalikda tahlil qilamiz?',
      isUser: false,
      suggestedActions: [
        '2x + 6 = 16 tenglamani qanday yechaman?',
        'Kasrlarni qanday qisqartiraman?',
        'Pifagor teoremasi nima?',
      ],
    ),
  ];

  void _sendMessage({String? customText, String action = 'chat'}) async {
    final text = customText ?? _textController.text.trim();
    if (text.isEmpty) return;

    if (customText == null) {
      _textController.clear();
    }

    setState(() {
      _messages.add(MessageItem(text: text, isUser: true));
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
        final actions = (data['suggestedActions'] as List<dynamic>?)
            ?.map((e) => e.toString())
            .toList();

        setState(() {
          _messages.add(MessageItem(
            text: reply,
            isUser: false,
            formulaLatex: formula,
            suggestedActions: actions,
          ));
          _currentStep = data['step'] ?? (_currentStep + 1);
          _isLoading = false;
        });
      }
    } catch (e) {
      // Local pedagogical fallback in natural Uzbek
      setState(() {
        if (action == 'next_step' || text.contains('Keyingi qadam')) {
          _messages.add(MessageItem(
            text:
                '1-qadam: Ikkala tomondan 6 ni ayirib tashlaymiz.\n2x = 16 - 6 => 2x = 10.',
            isUser: false,
            formulaLatex: '2x = 10',
            suggestedActions: ['Keyingi qadam', 'Batafsil tushuntir'],
          ));
        } else {
          _messages.add(MessageItem(
            text:
                'Ajoyib savol! Keling, buni bosqichma-bosqich ko‘rib chiqamiz. Avval noma’lum sonni tenglamaning bir tomonida qoldirishimiz kerak.',
            isUser: false,
            formulaLatex: '2x + 6 = 16',
            suggestedActions: ['Keyingi qadam', 'Batafsil tushuntir', 'O‘xshash misol ber'],
          ));
        }
        _isLoading = false;
      });
    }

    _scrollToBottom();
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
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: AppColors.kidsDarkText),
          onPressed: () => context.pop(),
        ),
        title: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration: const BoxDecoration(
                color: AppColors.kidsPrimary,
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.smart_toy_rounded, color: Colors.white, size: 22),
            ),
            const SizedBox(width: 10),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Ziyo AI Ustoz',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: AppColors.kidsDarkText,
                  ),
                ),
                Text(
                  'Onlayn • Matematika yordamchisi',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: AppColors.kidsGreen,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
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
                          'Ziyo ustoz o‘ylamoqda...',
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

          // Input Bar (Figma 2:38)
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: Colors.white,
              border: Border(top: BorderSide(color: AppColors.kidsBorder, width: 1.5)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  // Camera Icon for Math Scanner
                  IconButton(
                    icon: const Icon(Icons.camera_alt_outlined, color: AppColors.kidsPrimary),
                    onPressed: () {
                      _sendMessage(customText: 'Ushbu misolni rasm orqali skaner qiling: 2x + 6 = 16');
                    },
                  ),
                  Expanded(
                    child: TextField(
                      controller: _textController,
                      decoration: InputDecoration(
                        hintText: 'Misol yoki savolingizni yozing...',
                        filled: true,
                        fillColor: const Color(0xFFF6F7FE),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (val) => _sendMessage(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: const BoxDecoration(
                      color: AppColors.kidsPrimary,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_upward_rounded, color: Colors.white),
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
          maxWidth: MediaQuery.of(context).size.width * 0.85,
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
                  // Mathematical LaTeX Formula Rendering
                  if (msg.formulaLatex != null && msg.formulaLatex!.isNotEmpty) ...[
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
                ],
              ),
            ),
            // Suggested Pedagogical Action Chips (Figma 2:563 "KEYINGI QADAM")
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
                      final isNextStep = action.contains('Keyingi qadam');
                      _sendMessage(
                        customText: action,
                        action: isNextStep ? 'next_step' : 'chat',
                      );
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
