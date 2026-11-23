import 'dart:async';
import 'dart:io' show Platform;
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/theme/app_theme.dart';
import '../../core/network/api_client.dart';
import '../../core/widgets/coin_icon.dart';
import '../../core/widgets/mathcity_bottom_nav.dart';
import '../../core/widgets/user_avatar.dart';
import '../../shared/models/student_model.dart';
import '../../shared/providers/student_provider.dart';

class LeaderboardUser {
  final int rank;
  final String id;
  final String userId;
  final String username;
  final String displayName;
  final String? avatarUrl;
  final int totalXP;
  final int coinBalance;
  final int level;

  LeaderboardUser({
    required this.rank,
    required this.id,
    required this.userId,
    required this.username,
    required this.displayName,
    this.avatarUrl,
    required this.totalXP,
    required this.coinBalance,
    required this.level,
  });

  factory LeaderboardUser.fromJson(Map<String, dynamic> json) {
    final uid = (json['userId'] ?? json['id'] ?? '').toString();
    return LeaderboardUser(
      rank: (json['rank'] as num?)?.toInt() ?? 1,
      id: uid,
      userId: uid,
      username: (json['username'] as String?) ?? 'foydalanuvchi',
      displayName: (json['displayName'] as String?) ?? 'O‘quvchi',
      avatarUrl: json['avatarUrl'] as String?,
      totalXP: (json['totalXP'] ?? json['xp'] as num?)?.toInt() ?? 0,
      coinBalance: (json['coinBalance'] ?? json['coins'] as num?)?.toInt() ?? 0,
      level: (json['level'] as num?)?.toInt() ?? 1,
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
  String? _errorMessage;
  Timer? _pollingTimer;
  Timer? _highlightClearTimer;

  final List<Map<String, String>> _scopes = const [
    {'id': 'top100', 'label': 'Top 100'},
    {'id': 'top50', 'label': 'Top 50'},
    {'id': 'top10', 'label': 'Top 10'},
    {'id': 'top5', 'label': 'Top 5'},
  ];
  String _selectedScope = 'top100';
  int _coinsToTop100 = 0;
  int _coinsToNextRank = 0;

  // Track previous ranks to animate rank climb and highlight users who move up
  final Map<String, int> _previousRanks = {};
  Set<String> _highlightedUserIds = {};

  late AnimationController _shimmerController;

  @override
  void initState() {
    super.initState();
    _shimmerController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 3),
    )..repeat();

    _loadLeaderboard();

    // Live background polling every 12 seconds while screen is open
    _pollingTimer = Timer.periodic(const Duration(seconds: 12), (_) {
      if (mounted) _loadLeaderboard(silent: true);
    });
  }

  @override
  void dispose() {
    _pollingTimer?.cancel();
    _highlightClearTimer?.cancel();
    _shimmerController.dispose();
    super.dispose();
  }

  Future<void> _loadLeaderboard({bool silent = false}) async {
    if (!silent) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });
    }

    final isTest = !kIsWeb && Platform.environment.containsKey('FLUTTER_TEST');
    if (isTest) {
      final student = ref.read(studentProvider).student;
      setState(() {
        _leaderboard = [
          LeaderboardUser(
            rank: 1,
            id: 'demo-1',
            userId: 'demo-1',
            username: 'jasur_matem',
            displayName: 'Jasur',
            totalXP: 450,
            coinBalance: 85,
            level: 5,
          ),
          LeaderboardUser(
            rank: 2,
            id: 'demo-2',
            userId: 'demo-2',
            username: 'madina_algeb',
            displayName: 'Madina',
            totalXP: 320,
            coinBalance: 50,
            level: 4,
          ),
          LeaderboardUser(
            rank: 3,
            id: student?.id ?? 'demo-3',
            userId: student?.id ?? 'demo-3',
            username: student?.username ?? 'mirzobek',
            displayName: student?.displayName ?? 'Mirzobek',
            avatarUrl: student?.avatarUrl,
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
      final res = await ApiClient().dio.get(
        '/students/leaderboard',
        queryParameters: {'scope': _selectedScope},
      );
      if (res.data['success'] == true) {
        final data = res.data['data'];
        final list = (data['leaderboard'] as List<dynamic>?)
                ?.map((item) => LeaderboardUser.fromJson(item))
                .toList() ??
            [];
        final myRankJson = data['me'] ?? data['myRank'];

        final climbingUsers = <String>{};
        for (final u in list) {
          final oldRank = _previousRanks[u.id];
          if (oldRank != null && u.rank < oldRank) {
            climbingUsers.add(u.id);
          }
          _previousRanks[u.id] = u.rank;
        }

        // Fetch detailed me stats
        try {
          final meRes = await ApiClient().dio.get('/students/leaderboard/me');
          if (meRes.data['success'] == true && meRes.data['data'] != null) {
            final meData = meRes.data['data'];
            _coinsToTop100 = meData['coinsToTop100'] ?? 0;
            _coinsToNextRank = meData['coinsToNextRank'] ?? 0;
          }
        } catch (_) {}

        if (mounted) {
          setState(() {
            _leaderboard = list;
            if (myRankJson != null) {
              _myRank = LeaderboardUser.fromJson(myRankJson);
            }
            if (climbingUsers.isNotEmpty) {
              _highlightedUserIds = climbingUsers;
              _highlightClearTimer?.cancel();
              _highlightClearTimer = Timer(const Duration(milliseconds: 1400), () {
                if (mounted) {
                  setState(() => _highlightedUserIds.clear());
                }
              });
            }
            _isLoading = false;
            _errorMessage = null;
          });
        }
        return;
      }
    } catch (e) {
      if (mounted && !silent) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Reytingni yuklab bo‘lmadi. Qayta urinib ko‘ring.';
        });
      }
    }

    if (mounted && !silent) {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final colors = AppThemeColors.of(context);
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      backgroundColor: colors.bg,
      extendBody: true,
      bottomNavigationBar: const MathCityBottomNav(currentIndex: 3),
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
                          HapticFeedback.lightImpact();
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
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.04),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
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
                        onTap: () {
                          HapticFeedback.lightImpact();
                          _loadLeaderboard();
                        },
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: colors.card,
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: colors.border),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.04),
                                blurRadius: 8,
                                offset: const Offset(0, 2),
                              ),
                            ],
                          ),
                          child: Icon(Icons.refresh_rounded, color: colors.primary, size: 20),
                        ),
                      ),
                    ],
                  ),
                ),

                // Scope Selector Tabs: [Top 100], [Top 50], [Top 10], [Top 5]
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
                  child: Container(
                    padding: const EdgeInsets.all(4),
                    decoration: BoxDecoration(
                      color: colors.card,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: colors.border),
                    ),
                    child: Row(
                      children: _scopes.map((s) {
                        final isSelected = _selectedScope == s['id'];
                        return Expanded(
                          child: GestureDetector(
                            onTap: () {
                              if (_selectedScope != s['id']) {
                                HapticFeedback.selectionClick();
                                setState(() {
                                  _selectedScope = s['id']!;
                                });
                                _loadLeaderboard();
                              }
                            },
                            child: AnimatedContainer(
                              duration: const Duration(milliseconds: 200),
                              padding: const EdgeInsets.symmetric(vertical: 8),
                              decoration: BoxDecoration(
                                color: isSelected ? const Color(0xFF6C55E0) : Colors.transparent,
                                borderRadius: BorderRadius.circular(12),
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                s['label']!,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w800,
                                  color: isSelected ? Colors.white : colors.muted,
                                ),
                              ),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ),
                ),

                // Main Content
                Expanded(
                  child: _isLoading
                      ? const Center(child: CircularProgressIndicator())
                      : _errorMessage != null
                          ? _buildErrorState(colors)
                          : _leaderboard.isEmpty
                              ? _buildEmptyState(colors, isDark)
                              : RefreshIndicator(
                                  onRefresh: () => _loadLeaderboard(),
                                  color: colors.primary,
                                  backgroundColor: colors.card,
                                  child: Builder(
                                    builder: (context) {
                                      final remainingCount = _leaderboard.length > 3 ? _leaderboard.length - 3 : 0;
                                      final showFewBanner = _leaderboard.length < 5;
                                      final totalCount = 1 + remainingCount + (showFewBanner ? 1 : 0);

                                      return ListView.builder(
                                        padding: const EdgeInsets.fromLTRB(16, 4, 16, 175),
                                        physics: const AlwaysScrollableScrollPhysics(parent: BouncingScrollPhysics()),
                                        itemCount: totalCount,
                                        itemBuilder: (context, index) {
                                          if (index == 0) {
                                            return _buildTop3Podium(colors, isDark);
                                          }
                                          if (index > remainingCount) {
                                            return _buildFewUsersBanner(colors, isDark);
                                          }
                                          final user = _leaderboard[2 + index];
                                          final currentStudent = ref.watch(studentProvider).student;
                                          final isMyRow = (_myRank != null && (user.id == _myRank!.id || user.userId == _myRank!.userId)) ||
                                              (currentStudent != null && (user.id == currentStudent.id || user.userId == currentStudent.id));
                                          final isHighlighted = _highlightedUserIds.contains(user.id);
                                          return AnimatedContainer(
                                            duration: const Duration(milliseconds: 450),
                                            curve: Curves.easeInOutCubic,
                                            child: _buildLeaderboardCard(
                                              user: user,
                                              isMyRow: isMyRow,
                                              isHighlighted: isHighlighted,
                                              colors: colors,
                                              isDark: isDark,
                                            ),
                                          );
                                        },
                                      );
                                    },
                                  ),
                                ),
                ),
              ],
            ),

            // Sticky Bottom Personal Rank Card (Sizning joriy o'rningiz)
            if (_myRank != null)
              Positioned(
                left: 16,
                right: 16,
                bottom: 92,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(
                      colors: [Color(0xFF5B3BE8), Color(0xFF7A58F8)],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: Colors.white.withOpacity(0.35), width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF5B3BE8).withOpacity(0.45),
                        blurRadius: 22,
                        offset: const Offset(0, 8),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      // Rank number badge
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
                      const SizedBox(width: 12),

                      // User Avatar
                      UserAvatar(
                        avatarUrl: _myRank!.avatarUrl,
                        displayName: _myRank!.displayName.isNotEmpty ? _myRank!.displayName : _myRank!.username,
                        size: 38,
                        borderColor: Colors.white,
                        borderWidth: 1.5,
                      ),
                      const SizedBox(width: 12),

                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Siz ${_myRank!.rank}-o‘rindasiz • ${_myRank!.coinBalance} coin • ${_myRank!.totalXP} XP${_coinsToTop100 > 0 ? " • Top 100 ga $_coinsToTop100 coin qoldi" : (_coinsToNextRank > 0 ? " • Keyingi o‘ringa $_coinsToNextRank coin qoldi" : "")}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: Colors.white,
                              ),
                            ),
                            const SizedBox(height: 2),
                            Text(
                              '@${_myRank!.username}',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w700,
                                color: Color(0xFFFFD66B),
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Coin & XP stats with animated counter
                      Row(
                        children: [
                          const CoinIcon(size: 16),
                          const SizedBox(width: 4),
                          TweenAnimationBuilder<double>(
                            tween: Tween<double>(
                              begin: _myRank!.coinBalance.toDouble(),
                              end: _myRank!.coinBalance.toDouble(),
                            ),
                            duration: const Duration(milliseconds: 600),
                            curve: Curves.easeOutCubic,
                            builder: (context, val, child) {
                              return Text(
                                '${val.round()}',
                                style: const TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFFFFD66B),
                                ),
                              );
                            },
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

  Widget _buildLeaderboardCard({
    required LeaderboardUser user,
    required bool isMyRow,
    required bool isHighlighted,
    required AppThemeColors colors,
    required bool isDark,
  }) {
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
          color: isMyRow ? const Color(0xFF6C55E0) : colors.border,
          width: isMyRow ? 2.2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: isMyRow
                ? const Color(0x226C55E0)
                : Colors.black.withOpacity(0.02),
            blurRadius: 10,
            offset: const Offset(0, 3),
          ),
        ],
      );
      rankTextColor = colors.muted;
      rankBadgeIcon = null;
    }

    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: decoration.copyWith(
        color: isHighlighted ? const Color(0xFFD1FAE5) : null,
      ),
      child: Row(
        children: [
          // Rank Badge
          SizedBox(
            width: 38,
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

          // Real User Avatar
          UserAvatar(
            avatarUrl: user.avatarUrl,
            displayName: user.displayName.isNotEmpty ? user.displayName : user.username,
            size: 42,
            borderColor: user.rank == 1 ? const Color(0xFFFFB300) : colors.border,
            borderWidth: user.rank == 1 ? 2.0 : 1.2,
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
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF6C55E0),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          'Siz',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                    if (isHighlighted) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFF10B981),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Text(
                          '↑ +1',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                const SizedBox(height: 3),
                Text(
                  '${user.level}-daraja',
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: user.rank == 1 ? const Color(0xFF92400E) : colors.muted,
                  ),
                ),
              ],
            ),
          ),

          // Coins and XP
          Row(
            children: [
              const CoinIcon(size: 16),
              const SizedBox(width: 4),
              Text(
                '${user.coinBalance}',
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.w900,
                  color: user.rank == 1 ? const Color(0xFF92400E) : const Color(0xFFD97706),
                ),
              ),
              const SizedBox(width: 10),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: user.rank == 1
                      ? const Color(0xFFFFB300).withOpacity(0.2)
                      : (isDark ? const Color(0xFF281F5E) : const Color(0xFFEDE8FF)),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${user.totalXP} XP',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: user.rank == 1 ? const Color(0xFF78350F) : const Color(0xFF6C55E0),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTop3Podium(AppThemeColors colors, bool isDark) {
    if (_leaderboard.isEmpty) return const SizedBox.shrink();

    final first = _leaderboard.isNotEmpty ? _leaderboard[0] : null;
    final second = _leaderboard.length > 1 ? _leaderboard[1] : null;
    final third = _leaderboard.length > 2 ? _leaderboard[2] : null;

    final currentStudent = ref.watch(studentProvider).student;

    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 12, 4, 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          // 2nd Place (Silver) - Left
          if (second != null)
            Expanded(
              child: _buildPodiumColumn(
                user: second,
                rank: 2,
                pedestalHeight: 105,
                podiumColor: const Color(0xFF94A3B8),
                gradientColors: isDark
                    ? [const Color(0xFF2E3447), const Color(0xFF1E2330)]
                    : [const Color(0xFFE2E8F0), const Color(0xFFCBD5E1)],
                badgeIcon: '🥈',
                crown: false,
                colors: colors,
                isDark: isDark,
                currentStudent: currentStudent,
              ),
            )
          else
            const Expanded(child: SizedBox.shrink()),

          const SizedBox(width: 8),

          // 1st Place (Gold) - Center (Tallest)
          if (first != null)
            Expanded(
              flex: 12,
              child: _buildPodiumColumn(
                user: first,
                rank: 1,
                pedestalHeight: 135,
                podiumColor: const Color(0xFFFFB800),
                gradientColors: isDark
                    ? [const Color(0xFF4A3816), const Color(0xFF33250A)]
                    : [const Color(0xFFFFE89E), const Color(0xFFFFD566)],
                badgeIcon: '👑',
                crown: true,
                colors: colors,
                isDark: isDark,
                currentStudent: currentStudent,
              ),
            ),

          const SizedBox(width: 8),

          // 3rd Place (Bronze) - Right
          if (third != null)
            Expanded(
              child: _buildPodiumColumn(
                user: third,
                rank: 3,
                pedestalHeight: 90,
                podiumColor: const Color(0xFFF97316),
                gradientColors: isDark
                    ? [const Color(0xFF3D271E), const Color(0xFF2B1912)]
                    : [const Color(0xFFFFDFC9), const Color(0xFFFFC8A8)],
                badgeIcon: '🥉',
                crown: false,
                colors: colors,
                isDark: isDark,
                currentStudent: currentStudent,
              ),
            )
          else
            const Expanded(child: SizedBox.shrink()),
        ],
      ),
    );
  }

  Widget _buildPodiumColumn({
    required LeaderboardUser user,
    required int rank,
    required double pedestalHeight,
    required Color podiumColor,
    required List<Color> gradientColors,
    required String badgeIcon,
    required bool crown,
    required AppThemeColors colors,
    required bool isDark,
    required StudentModel? currentStudent,
  }) {
    final isMe = (_myRank != null && (user.id == _myRank!.id || user.userId == _myRank!.userId)) ||
        (currentStudent != null && (user.id == currentStudent.id || user.userId == currentStudent.id));

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (crown)
          const Text('👑', style: TextStyle(fontSize: 24))
        else
          const SizedBox(height: 12),

        const SizedBox(height: 2),

        // Avatar with podium border
        Stack(
          clipBehavior: Clip.none,
          alignment: Alignment.center,
          children: [
            Container(
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: podiumColor.withOpacity(0.35),
                    blurRadius: 10,
                    offset: const Offset(0, 3),
                  ),
                ],
              ),
              child: UserAvatar(
                avatarUrl: user.avatarUrl,
                displayName: user.displayName.isNotEmpty ? user.displayName : user.username,
                size: rank == 1 ? 54 : 44,
                borderColor: podiumColor,
                borderWidth: rank == 1 ? 2.5 : 2.0,
              ),
            ),
            Positioned(
              bottom: -5,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                decoration: BoxDecoration(
                  color: podiumColor,
                  borderRadius: BorderRadius.circular(8),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.2),
                      blurRadius: 4,
                      offset: const Offset(0, 1),
                    ),
                  ],
                ),
                child: Text(
                  '#$rank',
                  style: const TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w900,
                    color: Colors.black87,
                  ),
                ),
              ),
            ),
          ],
        ),

        const SizedBox(height: 10),

        // Display Name
        Text(
          isMe ? 'Siz' : user.displayName,
          maxLines: 1,
          overflow: TextOverflow.ellipsis,
          style: TextStyle(
            fontSize: 11.5,
            fontWeight: FontWeight.w800,
            color: isMe ? const Color(0xFF6C55E0) : colors.ink,
          ),
        ),

        const SizedBox(height: 2),

        // Coin count
        Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            const CoinIcon(size: 12),
            const SizedBox(width: 3),
            Text(
              '${user.coinBalance}',
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w800,
                color: isDark ? const Color(0xFFFFD66B) : const Color(0xFFB45309),
              ),
            ),
          ],
        ),

        const SizedBox(height: 6),

        // Pedestal Body
        Container(
          width: double.infinity,
          height: pedestalHeight,
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: gradientColors,
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
            borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
            border: Border.all(
              color: podiumColor.withOpacity(0.55),
              width: 1.5,
            ),
            boxShadow: [
              BoxShadow(
                color: podiumColor.withOpacity(0.18),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              const SizedBox(height: 8),
              Text(
                badgeIcon,
                style: const TextStyle(fontSize: 20),
              ),
              const SizedBox(height: 2),
              Text(
                '$rank',
                style: TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w900,
                  color: isDark ? Colors.white.withOpacity(0.85) : Colors.black.withOpacity(0.65),
                ),
              ),
              if (isMe)
                Container(
                  margin: const EdgeInsets.only(top: 2),
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 1.5),
                  decoration: BoxDecoration(
                    color: const Color(0xFF6C55E0),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    'SIZ',
                    style: TextStyle(
                      fontSize: 8.5,
                      fontWeight: FontWeight.w900,
                      color: Colors.white,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEmptyState(AppThemeColors colors, bool isDark) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: const Color(0xFF6C55E0).withOpacity(0.12),
                shape: BoxShape.circle,
              ),
              child: const Center(
                child: Text('🌱', style: TextStyle(fontSize: 40)),
              ),
            ),
            const SizedBox(height: 18),
            Text(
              'Yana o‘quvchilar qo‘shilishini kuting',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w900,
                color: colors.ink,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Hozircha yangi do‘stlaringiz safimizga qo‘shilmoqda. Misollarni yechib, birinchi bo‘lib peshqadamga aylaning!',
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: colors.muted,
                height: 1.45,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildFewUsersBanner(AppThemeColors colors, bool isDark) {
    return Container(
      margin: const EdgeInsets.only(top: 14, bottom: 20),
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF231C4D).withOpacity(0.65) : const Color(0xFFF4F0FF),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: const Color(0xFF6C55E0).withOpacity(0.25),
          width: 1.2,
        ),
      ),
      child: Row(
        children: [
          Container(
            width: 44,
            height: 44,
            decoration: BoxDecoration(
              color: const Color(0xFF6C55E0).withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Center(
              child: Text('🌱', style: TextStyle(fontSize: 22)),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  'Yana o‘quvchilar qo‘shilishini kuting',
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: colors.ink,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  'Tez orada yangi do‘stlaringiz safimizga qo‘shiladi. Birgalikda mashq qilib, peshqadamlikka intiling!',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: colors.muted,
                    height: 1.35,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState(AppThemeColors colors) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.wifi_off_rounded, size: 48, color: colors.muted),
            const SizedBox(height: 12),
            Text(
              _errorMessage ?? 'Serverga ulanib bo‘lmadi',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700, color: colors.ink),
            ),
            const SizedBox(height: 16),
            ElevatedButton(
              style: ElevatedButton.styleFrom(
                backgroundColor: colors.primary,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              onPressed: () => _loadLeaderboard(),
              child: const Text('Qayta urinish', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700)),
            ),
          ],
        ),
      ),
    );
  }
}
