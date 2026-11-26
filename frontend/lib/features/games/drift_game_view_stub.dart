import 'package:flutter/material.dart';

Widget buildDriftGameView({
  required BuildContext context,
  required Function(String type, Map<String, dynamic> data) onMessageFromGame,
}) {
  return Container(
    color: const Color(0xFF09090B),
    child: Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: const [
          Icon(Icons.sports_motorsports_rounded,
              size: 64, color: Color(0xFF10B981)),
          SizedBox(height: 16),
          Text(
            'MathCity 3D Drift & Poyga',
            style: TextStyle(
                color: Colors.white, fontSize: 22, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8),
          Text(
            'Ushbu 3D o‘yin WebGL platformasida ishlaydi.',
            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 14),
          ),
        ],
      ),
    ),
  );
}

void postMessageToDriftGame(String type, Map<String, dynamic> data) {
  // No-op for non-web platforms
}
