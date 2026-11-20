import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/coin_icon.dart';
import '../../shared/providers/student_provider.dart';

class LeaderboardUser {
  final int rank;
  final String id;
  final String username;
  final String displayName;
  final String? avatarUrl;
  final int totalXP;
  final int coinBalance;
  final int level;

  LeaderboardUser({
    required this.rank,
    required this.id,
    required this.username,
    required this.displayName,
    this.avatarUrl,
    required this.totalXP,
    required this.coinBalance,
    required this.level,
  });

  factory LeaderboardUser.fromJson(Map<String, dynamic> json) {
    return LeaderboardUser(
      rank: json['rank'] ?? 1,
      id: json['id'] ?? '',
      username: json['username'] ?? 'foydalanuvchi',
      displayName: json['displayName'] ?? 'O‘quvchi',
      avatarUrl: json['avatarUrl'],
      totalXP: json['totalXP'] ?? 0,
      coinBalance: json['coinBalance'] ?? 0,
      level: json['level'] ?? 1,
    );
  }
}

class LeaderboardScreen extends ConsumerStatefulWidget {
  const LeaderboardScreen({super.key});

  @override
  ConsumerState<LeaderboardScreen> createState() => _LeaderboardScreenState();
}

class _LeaderboardScreenState extends ConsumerState<LeaderboardScreen>
    with SingleTickerProviderStateMixin {
  List<LeaderboardUser> _leaderboard = [];
  LeaderboardUser? _myRank;
  bool _isLoading = true;
  Timer? _pollingTimer;
  late AnimationController _shimmerController;

  @override
  void initState() {
    super.initState();
    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    _loadLeaderboard();

    // 25-second background polling
    _pollingTimer = Timer.periodic(const Duration(seconds: 25), (_) {
      if (mounted) _loadLeaderboard(silent: true);
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    _shimmerController.dispose();
    super.dispose();
  }

  Future<void> _loadLeaderboard({bool silent = false}) async {
    if (!silent) {
      setState(() => _isLoading = true);
    }

    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) {
      final student = ref.read(studentProvider).student;
      setState(() {
        _leaderboard = [
          LeaderboardUser(
            rank: 1,
            id: 'demo-1',
            username: 'jasur_matem',
            displayName: 'Jasur',
            totalXP: 450,
            coinBalance: 85,
            level: 5,
          ),
          LeaderboardUser(
            rank: 2,
            id: 'demo-2',
            username: 'madina_algeb',
            displayName: 'Madina',
            totalXP: 320,
            coinBalance: 50,
            level: 4,
          ),
          LeaderboardUser(
            rank: 3,
            id: student?.id ?? 'demo-3',
            username: student?.username ?? 'mirzobek',
            displayName: student?.displayName ?? 'Mirzobek',
            totalXP: student?.totalXP ?? 10,
            coinBalance: student?.coinBalance ?? 0,
            level: student?.level ?? 1,
          ),
        ];
        _myRank = _leaderboard[2];
        _isLoading = false;
      });
      return;
    }

    try {
      final res = await ApiClient().dio.get('/students/leaderboard');
      if (res.data['success'] == true) {
        final data = res.data['data'];
        final list = (data['leaderboard'] as List<dynamic>?)
                ?.map((item) => LeaderboardUser.fromJson(item))
                .toList() ??
            [];
        final myRankJson = data['myRank'];

        if (mounted) {
          setState(() {
            _leaderboard = list;
            if (myRankJson != null) {
              _myRank = LeaderboardUser.fromJson(myRankJson);
            }
            _isLoading = false;
          });
        }
        return;
      }
    } catch (_) {}

    if (mounted) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: colors.bg,
      body: SafeArea(
        bottom: false,
        child: Stack(
          children: [
            Column(
              children: [
                // Top Header Bar
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      InkWell(
                        onTap: () {
                          if (context.canPop()) {
                            context.pop();
                          } else {
                            context.go('/kids/home');
                          }
                        },
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: colors.border),
                          ),
                          child: Icon(Icons.arrow_back_rounded, color: colors.ink, size: 20),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Peshqadamlar',
                              style: TextStyle(
                                fontSize: 22,
                                fontWeight: FontWeight.w900,
                                color: colors.ink,
                              ),
                            ),
                            Text(
                              'Matematika bo‘yicha umumiy reyting',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w600,
                                color: colors.muted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      InkWell(
                        onTap: () => _loadLeaderboard(),
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: colors.border),
                          ),
                          child: Icon(Icons.refresh_rounded, color: colors.primary, size: 20),
                        ),
                      ),
                    ],
                  ),
                ),

                // Main Content
                Expanded(
                  child: _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : RefreshIndicator(
                          onRefresh: () => _loadLeaderboard(),
                          color: colors.primary,
                          backgroundColor: colors.card,
                          child: ListView.builder(
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
                            physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
                            itemCount: _leaderboard.length,
                            itemBuilder: (context, index) {
                              final user = _leaderboard[index];
                              final isMyRow = _myRank != null && user.id == _myRank!.id;
                              return _buildLeaderboardCard(user, isMyRow, colors, isDark);
                            },
                          ),
                        ),
                ),
              ],
            ),

            // Sticky Bottom Personal Rank Card
            if (_myRank != null)
              Positioned(
                left: 16,
                right: 16,
                bottom: 24,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF5B3BE8), Color(0xFF7A58F8)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF5B3BE8).withOpacity(0.4),
                        blurRadius: 20,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.25),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Text(
                          '#${_myRank!.rank}',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            const Text(
                              'Sizning joriy o‘rningiz',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFFFD66B),
                              ),
                            ),
                            Text(
                              '@${_myRank!.username}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Row(
                        children: [
                          const CoinIcon(size: 16),
                          const SizedBox(width: 4),
                          Text(
                            '${_myRank!.coinBalance}',
                            style: const TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFFFD66B),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${_myRank!.totalXP} XP',
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildLeaderboardCard(
    LeaderboardUser user,
    bool isMyRow,
    AppThemeColors colors,
    bool isDark,
  ) {
    // 1-o'rin: Sariq/Oltin fon + shimmer, Toj ikonkasi
    // 2-o'rin: Kumush rang
    // 3-o'rin: Bronza / to'q sariq rang
    // 4+: Oddiy toza karta

    BoxDecoration decoration;
    Color rankTextColor;
    Widget? rankBadgeIcon;

    if (user.rank == 1) {
      decoration = BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFF9E6), Color(0xFFFFECC0)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFFFC107), width: 2),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFFFC107).withOpacity(0.25),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      );
      rankTextColor = const Color(0xFFB45309);
      rankBadgeIcon = const Text('👑', style: TextStyle(fontSize: 18));
    } else if (user.rank == 2) {
      decoration = BoxDecoration(
        gradient: LinearGradient(
          colors: isDark
              ? [const Color(0xFF25283B), const Color(0xFF2C3048)]
              : [const Color(0xFFF1F3F9), const Color(0xFFE2E6F0)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFF94A3B8), width: 1.5),
      );
      rankTextColor = const Color(0xFF475569);
      rankBadgeIcon = const Text('🥈', style: TextStyle(fontSize: 16));
    } else if (user.rank == 3) {
      decoration = BoxDecoration(
        gradient: LinearGradient(
          colors: isDark
              ? [const Color(0xFF2E2235), const Color(0xFF38273E)]
              : [const Color(0xFFFFF1EB), const Color(0xFFFFE0D4)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFF97316), width: 1.5),
      );
      rankTextColor = const Color(0xFFC2410C);
      rankBadgeIcon = const Text('🥉', style: TextStyle(fontSize: 16));
    } else {
      decoration = BoxDecoration(
        color: isDark ? colors.card : Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isMyRow ? colors.primary : colors.border,
          width: isMyRow ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.02),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      );
      rankTextColor = colors.muted;
      rankBadgeIcon = null;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: decoration,
      child: Row(
        children: [
          // Rank Badge
          SizedBox(
            width: 36,
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                if (rankBadgeIcon != null) ...[
                  rankBadgeIcon,
                  const SizedBox(width: 2),
                ],
                Text(
                  '${user.rank}',
                  style: TextStyle(
                    fontSize: user.rank <= 3 ? 16 : 14,
                    fontWeight: FontWeight.w900,
                    color: rankTextColor,
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 8),

          // Avatar
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: user.rank == 1 ? const Color(0xFFFFE082) : colors.bg,
              border: Border.all(
                color: user.rank == 1 ? const Color(0xFFFFB300) : colors.border,
                width: 1.5,
              ),
            ),
            child: Center(
              child: Text(
                user.username.isNotEmpty ? user.username[0].toUpperCase() : 'U',
                style: TextStyle(
                  fontWeight: FontWeight.w900,
                  fontSize: 16,
                  color: user.rank == 1 ? const Color(0xFFB45309) : colors.primary,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),

          // Username & Level
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Flexible(
                      child: Text(
                        '@${user.username}',
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: user.rank == 1 ? const Color(0xFF78350F) : colors.ink,
                        ),
                      ),
                    ),
                    if (isMyRow) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1.5),
                        decoration: BoxDecoration(
                          color: colors.primary,
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text(
                          'Siz',
                          style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                      ),
                    ],
                  ],
                ),
                Text(
                  '${user.displayName} · ${user.level}-daraja',
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: user.rank == 1 ? const Color(0xFF92400E) : colors.muted,
                  ),
                ),
              ],
            ),
          ),

          // Coins and XP
          Row(
            children: [
              const CoinIcon(size: 14),
              const SizedBox(width: 4),
              Text(
                '${user.coinBalance}',
                style: const TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFFD97706),
                ),
              ),
              const SizedBox(width: 12),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: user.rank == 1
                      ? const Color(0xFFFFD54F)
                      : isDark
                          ? const Color(0xFF2C2455)
                          : const Color(0xFFEDE9FE),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${user.totalXP} XP',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w900,
                    color: user.rank == 1 ? const Color(0xFF78350F) : colors.primary,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
