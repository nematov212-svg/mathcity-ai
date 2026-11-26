import 'dart:convert';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

WebViewController? _globalHouseWebViewController;

Widget buildHouseGameView({
  required BuildContext context,
  required Function(String type, Map<String, dynamic> data) onMessageFromGame,
}) {
  if (kIsWeb) {
    return const SizedBox.shrink();
  }

  final isTest = Platform.environment.containsKey('FLUTTER_TEST');
  final isMobile = !isTest &&
      (defaultTargetPlatform == TargetPlatform.android ||
       defaultTargetPlatform == TargetPlatform.iOS);

  if (!isMobile) {
    return Container(
      color: const Color(0xFF0F172A),
      child: Center(
        child: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: const [
              Icon(Icons.home_work_rounded, size: 36, color: Color(0xFF8B5CF6)),
              SizedBox(height: 8),
              Text(
                'MathCity 3D Uy Qurish',
                style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold),
              ),
              SizedBox(height: 4),
              Text(
                'Ushbu 3D simulyator Web va Mobil (Android/iOS) platformalarida to‘liq ishlaydi.',
                style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  return _HouseGameMobileWebView(onMessageFromGame: onMessageFromGame);
}

void postMessageToHouseGame(String type, Map<String, dynamic> data) {
  if (_globalHouseWebViewController != null) {
    try {
      final jsonStr = jsonEncode({'type': type, 'data': data});
      _globalHouseWebViewController!.runJavaScript("window.postMessage($jsonStr, '*');");
    } catch (e) {
      debugPrint('Error posting message to mobile house game: $e');
    }
  }
}

class _HouseGameMobileWebView extends StatefulWidget {
  final Function(String type, Map<String, dynamic> data) onMessageFromGame;

  const _HouseGameMobileWebView({required this.onMessageFromGame});

  @override
  State<_HouseGameMobileWebView> createState() => _HouseGameMobileWebViewState();
}

class _HouseGameMobileWebViewState extends State<_HouseGameMobileWebView> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFF0F172A))
      ..addJavaScriptChannel(
        'FlutterChannel',
        onMessageReceived: (JavaScriptMessage msg) {
          try {
            final decoded = jsonDecode(msg.message);
            if (decoded is Map<String, dynamic> && decoded.containsKey('type')) {
              final type = decoded['type'].toString();
              final data = decoded['data'] is Map<String, dynamic>
                  ? decoded['data'] as Map<String, dynamic>
                  : <String, dynamic>{};
              widget.onMessageFromGame(type, data);
            }
          } catch (e) {
            debugPrint('Failed to parse mobile house game message: $e');
          }
        },
      )
      ..loadFlutterAsset('assets/house_game/index.html');

    _globalHouseWebViewController = _controller;
  }

  @override
  void dispose() {
    if (_globalHouseWebViewController == _controller) {
      _globalHouseWebViewController = null;
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return WebViewWidget(controller: _controller);
  }
}
