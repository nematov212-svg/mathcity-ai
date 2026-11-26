import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/network/api_client.dart';
import '../../shared/providers/student_provider.dart';
import 'drift_game_view.dart';

class DriftCarGameScreen extends ConsumerStatefulWidget {
  const DriftCarGameScreen({super.key});

  @override
  ConsumerState<DriftCarGameScreen> createState() => _DriftCarGameScreenState();
}

class _DriftCarGameScreenState extends ConsumerState<DriftCarGameScreen> {
  List<String> _ownedCars = ['samarkand_gt'];

  @override
  void initState() {
    super.initState();
    _fetchCars();
  }

  Future<void> _fetchCars() async {
    try {
      final res = await ApiClient().dio.get('/games/cars');
      if (res.data['success'] == true && res.data['data'] != null) {
        final rawData = res.data['data'];
        final carsList = rawData is List
            ? rawData
            : (rawData is Map ? rawData['cars'] as List? : null);
        if (carsList != null) {
          final owned = carsList
              .where((c) => c['isOwned'] == true || c['isUnlocked'] == true)
              .map((c) => c['key'].toString())
              .toList();
          if (mounted) {
            setState(() {
              _ownedCars = owned.isEmpty ? ['samarkand_gt'] : owned;
            });
            _syncUserToGame();
          }
        }
      }
    } catch (e) {
      debugPrint('Error fetching car ownership: $e');
    }
  }

  void _syncUserToGame() {
    final student = ref.read(studentProvider).student;
    postMessageToDriftGame('INIT_USER', {
      'userId': student?.id ?? 'guest-student',
      'coins': student?.coinBalance ?? 0,
      'token': '',
      'ownedCars': _ownedCars,
    });
  }

  void _handleGameMessage(String type, Map<String, dynamic> data) async {
    debugPrint('Received from 3D Drift Game: $type, data: $data');

    switch (type) {
      case 'MATHCITY_GAME_READY':
        _syncUserToGame();
        break;

      case 'BUY_CAR':
        final carKey = data['carKey']?.toString() ?? '';
        final price = (data['price'] as num?)?.toInt() ?? 0;
        final student = ref.read(studentProvider).student;
        final currentCoins = student?.coinBalance ?? 0;

        if (currentCoins < price) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(
                  'Oltin tangalar yetarli emas! Sizda: $currentCoins tanga, kerak: $price tanga.'),
              backgroundColor: Colors.redAccent,
            ),
          );
          return;
        }

        try {
          final res = await ApiClient().dio.post('/games/cars/$carKey/buy');
          if (res.data['success'] == true) {
            final resData = res.data['data'] ?? {};
            final newBal = resData['newCoinBalance'] ??
                resData['newBalance'] ??
                (currentCoins - price);
            if (!_ownedCars.contains(carKey)) {
              _ownedCars.add(carKey);
            }

            postMessageToDriftGame('CAR_BOUGHT_SUCCESS', {
              'carKey': carKey,
              'newBalance': newBal,
            });

            await ref.read(studentProvider.notifier).refreshProfile();

            if (mounted) {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                      'Tabriklaymiz! Yangi mashina garajingizga qo‘shildi! 🏎️'),
                  backgroundColor: Color(0xFF10B981),
                ),
              );
            }
          }
        } catch (e) {
          debugPrint('Error purchasing car: $e');
        }
        break;

      case 'CUSTOMIZE_CAR':
        final carKey = data['carKey']?.toString() ?? '';
        final color = data['color']?.toString();
        final wheels = data['wheels']?.toString();
        try {
          await ApiClient().dio.post(
            '/games/cars/$carKey/customize',
            data: {'color': color, 'wheels': wheels},
          );
        } catch (e) {
          debugPrint('Error customizing car: $e');
        }
        break;

      case 'REPAIR_CAR':
        final carKey = data['carKey']?.toString() ?? '';
        try {
          final res = await ApiClient().dio.post('/games/cars/$carKey/repair');
          if (res.data['success'] == true) {
            await ref.read(studentProvider.notifier).refreshProfile();
          }
        } catch (e) {
          debugPrint('Error repairing car: $e');
        }
        break;

      case 'DRIFT_FINISHED':
        final carKey = data['carKey']?.toString() ?? 'samarkand_gt';
        final score = (data['score'] as num?)?.toInt() ?? 0;
        final maxCombo = (data['maxCombo'] as num?)?.toInt() ?? 1;
        final duration = (data['duration'] as num?)?.toInt() ?? 60;
        final maxSpeed = (data['maxSpeed'] as num?)?.toInt() ?? 100;

        try {
          final res = await ApiClient().dio.post(
            '/games/drift/score',
            data: {
              'carKey': carKey,
              'score': score,
              'maxCombo': maxCombo,
              'durationSeconds': duration,
              'maxSpeed': maxSpeed,
            },
          );

          if (res.data['success'] == true) {
            final resData = res.data['data'];
            final coinsAwarded = resData['coinsAwarded'] ?? 0;
            final newBalance = resData['newBalance'];

            postMessageToDriftGame('DRIFT_RECORDED_SUCCESS', {
              'coinsAwarded': coinsAwarded,
              'newBalance': newBalance,
            });

            await ref.read(studentProvider.notifier).refreshProfile();

            if (mounted && coinsAwarded > 0) {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(
                  content: Text(
                      'Ajoyib drift! +$coinsAwarded oltin tanga yutib oldingiz! 🪙🔥'),
                  backgroundColor: const Color(0xFF10B981),
                  duration: const Duration(seconds: 4),
                ),
              );
            }
          }
        } catch (e) {
          debugPrint('Error recording drift score: $e');
        }
        break;

      case 'EXIT_TO_HUB':
        if (mounted) {
          if (context.canPop()) {
            context.pop();
          } else {
            context.go('/kids/games');
          }
        }
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF09090B),
      body: SafeArea(
        top: false,
        child: buildDriftGameView(
          context: context,
          onMessageFromGame: _handleGameMessage,
        ),
      ),
    );
  }
}
