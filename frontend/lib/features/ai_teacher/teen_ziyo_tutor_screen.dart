import 'package:flutter/material.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/network/api_client.dart';

class TeenZiyoTutorScreen extends StatefulWidget {
  const TeenZiyoTutorScreen({super.key});

  @override
  State<TeenZiyoTutorScreen> createState() => _TeenZiyoTutorScreenState();
}

class _TeenZiyoTutorScreenState extends State<TeenZiyoTutorScreen> {
  final _controller = TextEditingController();
  final ScrollController _scroll = ScrollController();
  bool _isLoading = false;

  final List<Map<String, dynamic>> _messages = [
    {
      'role': 'assistant',
      'text':
          'Assalomu alaykum. Men Ziyoman — o‘smirlar uchun ilg‘or matematika AI maslahatchisi. Tenglamalar, geometriya isbotlari yoki oliy matematika masalalarini yechishda yordam beraman.',
      'formula': 'f(x) = \\int x^2 dx = \\frac{x^3}{3} + C',
      'actions': ['Kvadrat tenglamani yechish', 'Hosila qoidasi', 'Pifagor isboti'],
    },
  ];

  void _send(String message) async {
    if (message.trim().isEmpty) return;
    _controller.clear();

    setState(() {
      _messages.add({
        'role': 'user',
        'text': message,
      });
      _isLoading = true;
    });

    _scrollDown();

    try {
      final res = await ApiClient().dio.post('/ai/chat', data: {
        'message': message,
        'action': 'chat',
      });

      if (res.data['success'] == true) {
        final data = res.data['data'];
        setState(() {
          _messages.add({
            'role': 'assistant',
            'text': data['reply'],
            'formula': data['formulaLatex'],
            'actions': data['suggestedActions'],
          });
          _isLoading = false;
        });
      }
    } catch (e) {
      setState(() {
        _messages.add({
          'role': 'assistant',
          'text':
              'Kvadrat tenglamani yechish algoritmi:\n1. Diskriminant: D = b² - 4ac.\n2. Agar D > 0 bo‘lsa, ildizlar: x = (-b ± √D) / (2a).',
          'formula': 'D = b^2 - 4ac \\implies x_{1,2} = \\frac{-b \\pm \\sqrt{D}}{2a}',
          'actions': ['Keyingi qadam', 'O‘xshash misol ber'],
        });
        _isLoading = false;
      });
    }

    _scrollDown();
  }

  void _scrollDown() {
    Future.delayed(const Duration(milliseconds: 150), () {
      if (_scroll.hasClients) {
        _scroll.animateTo(
          _scroll.position.maxScrollExtent,
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.teenBackground,
      appBar: AppBar(
        backgroundColor: AppColors.teenSurface,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white),
          onPressed: () => context.pop(),
        ),
        title: const Row(
          children: [
            Icon(Icons.psychology_rounded, color: AppColors.teenPrimaryLime, size: 26),
            SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Ziyo AI Ustoz • O‘smirlar',
                  style: TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.w800,
                    color: Colors.white,
                  ),
                ),
                Text(
                  'LaTeX & Simvolik tahlil tizimi',
                  style: TextStyle(
                    fontSize: 11,
                    color: AppColors.teenPrimaryLime,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: ListView.builder(
              controller: _scroll,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length,
              itemBuilder: (context, index) {
                final msg = _messages[index];
                final isUser = msg['role'] == 'user';
                final formula = msg['formula'] as String?;
                final actions = msg['actions'] as List<dynamic>?;

                return Align(
                  alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
                  child: Container(
                    margin: const EdgeInsets.symmetric(vertical: 8),
                    constraints: BoxConstraints(
                      maxWidth: MediaQuery.of(context).size.width * 0.85,
                    ),
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: isUser ? AppColors.teenPrimaryLime : AppColors.teenSurface,
                      borderRadius: BorderRadius.circular(18),
                      border: Border.all(
                        color: isUser ? AppColors.teenPrimaryLime : AppColors.teenBorder,
                      ),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          msg['text'],
                          style: TextStyle(
                            color: isUser ? AppColors.teenLimeTextDark : Colors.white,
                            fontSize: 14,
                            height: 1.4,
                            fontWeight: isUser ? FontWeight.w700 : FontWeight.w400,
                          ),
                        ),
                        if (formula != null && formula.isNotEmpty) ...[
                          const SizedBox(height: 10),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                            decoration: BoxDecoration(
                              color: const Color(0xFF0D1220),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Math.tex(
                              formula,
                              textStyle: const TextStyle(
                                color: AppColors.teenPrimaryLime,
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ],
                        if (actions != null && actions.isNotEmpty) ...[
                          const SizedBox(height: 10),
                          Wrap(
                            spacing: 8,
                            runSpacing: 6,
                            children: actions.map((a) {
                              return ActionChip(
                                backgroundColor: const Color(0xFF1E273D),
                                side: const BorderSide(color: AppColors.teenBorder),
                                label: Text(
                                  a.toString(),
                                  style: const TextStyle(
                                    color: AppColors.teenPrimaryLime,
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                                onPressed: () => _send(a.toString()),
                              );
                            }).toList(),
                          ),
                        ],
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
          if (_isLoading)
            const Padding(
              padding: EdgeInsets.only(bottom: 8),
              child: Center(
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    color: AppColors.teenPrimaryLime,
                  ),
                ),
              ),
            ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            color: AppColors.teenSurface,
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _controller,
                      style: const TextStyle(color: Colors.white),
                      decoration: InputDecoration(
                        hintText: 'Tenglama yoki savol kiriting...',
                        hintStyle: const TextStyle(color: AppColors.teenMutedText),
                        filled: true,
                        fillColor: const Color(0xFF101526),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(14),
                          borderSide: BorderSide.none,
                        ),
                      ),
                      onSubmitted: (val) => _send(val),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: BoxDecoration(
                      color: AppColors.teenPrimaryLime,
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.arrow_upward_rounded, color: AppColors.teenLimeTextDark),
                      onPressed: () => _send(_controller.text),
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
}
