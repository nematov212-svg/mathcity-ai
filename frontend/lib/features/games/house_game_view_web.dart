// ignore_for_file: avoid_web_libraries_in_flutter
import 'dart:async';
import 'dart:convert';
import 'dart:html' as html;
import 'dart:ui_web' as ui_web;
import 'package:flutter/material.dart';

Widget buildHouseGameView({
  required BuildContext context,
  required Function(String type, Map<String, dynamic> data) onMessageFromGame,
}) {
  return _HouseGameWebWidget(onMessageFromGame: onMessageFromGame);
}

void postMessageToHouseGame(String type, Map<String, dynamic> data) {
  try {
    final iframe = html.document.getElementById('house-game-iframe')
        as html.IFrameElement?;
    iframe?.contentWindow?.postMessage({'type': type, 'data': data}, '*');
  } catch (e) {
    debugPrint('postMessageToHouseGame error: $e');
  }
}

class _HouseGameWebWidget extends StatefulWidget {
  final Function(String type, Map<String, dynamic> data) onMessageFromGame;

  const _HouseGameWebWidget({required this.onMessageFromGame});

  @override
  State<_HouseGameWebWidget> createState() => _HouseGameWebWidgetState();
}

class _HouseGameWebWidgetState extends State<_HouseGameWebWidget> {
  static bool _viewRegistered = false;
  static const String _viewType = 'house-3d-builder-view';
  StreamSubscription<html.MessageEvent>? _messageSub;

  @override
  void initState() {
    super.initState();
    _registerView();
    _listenToPostMessages();
  }

  void _registerView() {
    if (!_viewRegistered) {
      ui_web.platformViewRegistry.registerViewFactory(_viewType, (int viewId) {
        final iframe = html.IFrameElement()
          ..src = 'house_game/index.html'
          ..id = 'house-game-iframe'
          ..style.border = 'none'
          ..style.width = '100%'
          ..style.height = '100%'
          ..allow = 'autoplay; fullscreen; accelerometer; gyroscope';
        return iframe;
      });
      _viewRegistered = true;
    }
  }

  void _listenToPostMessages() {
    _messageSub = html.window.onMessage.listen((event) {
      try {
        final rawData = event.data;
        if (rawData == null) return;

        Map<String, dynamic>? dataMap;
        if (rawData is Map) {
          dataMap = Map<String, dynamic>.from(rawData);
        } else if (rawData is String) {
          final decoded = jsonDecode(rawData);
          if (decoded is Map) {
            dataMap = Map<String, dynamic>.from(decoded);
          }
        }

        if (dataMap != null && dataMap.containsKey('type')) {
          final type = dataMap['type'].toString();
          final data = dataMap['data'] is Map
              ? Map<String, dynamic>.from(dataMap['data'])
              : <String, dynamic>{};
          widget.onMessageFromGame(type, data);
        }
      } catch (e) {
        debugPrint('Error parsing postMessage from house game: $e');
      }
    });
  }

  @override
  void dispose() {
    _messageSub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return const HtmlElementView(viewType: _viewType);
  }
}
