import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/constants/app_colors.dart';
import '../../core/widgets/coin_badge.dart';
import '../../shared/providers/student_provider.dart';

class GamesHubScreen extends ConsumerStatefulWidget {
  const GamesHubScreen({super.key});

  @override
  ConsumerState<GamesHubScreen> createState() => _GamesHubScreenState();
}

class _GamesHubScreenState extends ConsumerState<GamesHubScreen> {
  String _selectedFilter = 'Barchasi'; // 'Barchasi', 'Oson', 'O‘rta'

  @override
  Widget build(BuildContext context) {
    final studentState = ref.watch(studentProvider);
    final coinBalance = studentState.student?.coinBalance ?? 250;

    return Scaffold(
      backgroundColor: const Color(0xFFF9F8FE),
      body: SafeArea(
        child: Column(
          children: [
            // Top App Bar
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  InkWell(
                    onTap: () {
                      if (context.canPop()) {
                        context.pop();
                      } else {
                        context.go('/kids/home');
                      }
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: const Padding(
                      padding: EdgeInsets.symmetric(vertical: 4, horizontal: 2),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            Icons.arrow_back_ios_new_rounded,
                            size: 18,
                            color: Color(0xFF1E1B4B),
                          ),
                          SizedBox(width: 8),
                          Text(
                            'O‘yinlar',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF1E1B4B),
                              letterSpacing: -0.3,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  CoinBadge(count: coinBalance, size: 22),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
                children: [
                  // Hero Purple Gradient Banner
                  Container(
                    padding: const EdgeInsets.all(22),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF8B6FF8), Color(0xFF6B42F5), Color(0xFF5E39EE)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(28),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF6B42F5).withOpacity(0.28),
                          blurRadius: 20,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    child: Stack(
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.18),
                                borderRadius: BorderRadius.circular(14),
                              ),
                              child: const Text(
                                'O‘YNA • O‘RGAN • YUT',
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 10,
                                  fontWeight: FontWeight.w800,
                                  letterSpacing: 1.0,
                                ),
                              ),
                            ),
                            const SizedBox(height: 12),
                            const Text(
                              'Matematika\no‘yinlari',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                height: 1.15,
                                letterSpacing: -0.4,
                              ),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'Bilimingizni oshiring,\ntangalar yuting!',
                              style: TextStyle(
                                color: Color(0xFFE2DCFF),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                                height: 1.3,
                              ),
                            ),
                          ],
                        ),
                        Positioned(
                          right: -10,
                          top: 0,
                          bottom: 0,
                          child: Center(
                            child: Image.asset(
                              'assets/games/banner_rocket.png',
                              width: 125,
                              height: 125,
                              fit: BoxFit.contain,
                              errorBuilder: (_, __, ___) => const Icon(
                                Icons.rocket_launch_rounded,
                                size: 80,
                                color: Colors.white38,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // "O‘yinni tanlang" & count row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'O‘yinni tanlang',
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF1E1B4B),
                        ),
                      ),
                      Text(
                        _getFilteredGamesCount(),
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 12),

                  // Filter Pills Row
                  Row(
                    children: [
                      _buildFilterChip('Barchasi'),
                      const SizedBox(width: 8),
                      _buildFilterChip('Oson'),
                      const SizedBox(width: 8),
                      _buildFilterChip('O‘rta'),
                    ],
                  ),

                  const SizedBox(height: 16),

                  // Game Card 1: Kosmik hisob
                  if (_shouldShowGame('Kosmik hisob'))
                    _buildGameCard(
                      title: 'Kosmik hisob',
                      description: 'Arifmetikani yeching,\nyulduzlarga uching!',
                      metaInfo: 'Oson – O‘rta  •  3 daqiqa',
                      rewardBadge: '+30 oltin tanga',
                      assetPath: 'assets/games/kosmik_icon.png',
                      fallbackIcon: Icons.rocket_launch_rounded,
                      onTap: () => context.push('/kids/games/space-math'),
                    ),

                  if (_shouldShowGame('Kosmik hisob')) const SizedBox(height: 14),

                  // Game Card 2: Kasrlar jangi
                  if (_shouldShowGame('Kasrlar jangi'))
                    _buildGameCard(
                      title: 'Kasrlar jangi',
                      description: 'Kasrlarni taqqoslang,\nfazoni zabt eting.',
                      metaInfo: 'O‘rta  •  4 daqiqa',
                      rewardBadge: '+40 oltin tanga',
                      assetPath: 'assets/games/fraction_icon.png',
                      fallbackIcon: Icons.pie_chart_rounded,
                      onTap: () => context.push('/kids/games/fraction-battle'),
                    ),

                  const SizedBox(height: 32),

                  // Motivational Footer Note
                  const Center(
                    child: Text(
                      'Har bir to‘g‘ri javob sizni oldinga olib boradi.',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w500,
                        color: Color(0xFF94A3B8),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            // Bottom Navigation Bar
            _buildBottomNav(context),
          ],
        ),
      ),
    );
  }

  String _getFilteredGamesCount() {
    int count = 0;
    if (_shouldShowGame('Kosmik hisob')) count++;
    if (_shouldShowGame('Kasrlar jangi')) count++;
    return '$count ta o‘yin';
  }

  bool _shouldShowGame(String gameName) {
    if (_selectedFilter == 'Barchasi') return true;
    if (_selectedFilter == 'Oson') return gameName == 'Kosmik hisob';
    if (_selectedFilter == 'O‘rta') return true;
    return true;
  }

  Widget _buildFilterChip(String label) {
    final isSelected = _selectedFilter == label;
    return InkWell(
      onTap: () => setState(() => _selectedFilter = label),
      borderRadius: BorderRadius.circular(20),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 7),
        decoration: BoxDecoration(
          color: isSelected ? const Color(0xFF0F172A) : Colors.white,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: isSelected ? const Color(0xFF0F172A) : const Color(0xFFE2E8F0),
            width: 1.2,
          ),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: const Color(0xFF0F172A).withOpacity(0.18),
                    blurRadius: 8,
                    offset: const Offset(0, 3),
                  )
                ]
              : null,
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12.5,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : const Color(0xFF64748B),
          ),
        ),
      ),
    );
  }

  Widget _buildGameCard({
    required String title,
    required String description,
    required String metaInfo,
    required String rewardBadge,
    required String assetPath,
    required IconData fallbackIcon,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(26),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(26),
          border: Border.all(color: const Color(0xFFF1F5F9), width: 1.4),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF1E1B4B).withOpacity(0.04),
              blurRadius: 18,
              offset: const Offset(0, 6),
            ),
          ],
        ),
        child: Row(
          children: [
            // Left Square Illustration Box
            Container(
              width: 76,
              height: 76,
              decoration: BoxDecoration(
                color: const Color(0xFFF5F3FF),
                borderRadius: BorderRadius.circular(20),
              ),
              child: ClipRRect(
                borderRadius: BorderRadius.circular(20),
                child: Image.asset(
                  assetPath,
                  fit: BoxFit.contain,
                  errorBuilder: (_, __, ___) => Icon(
                    fallbackIcon,
                    color: const Color(0xFF7C5CF8),
                    size: 38,
                  ),
                ),
              ),
            ),

            const SizedBox(width: 14),

            // Middle Info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                      letterSpacing: -0.2,
                    ),
                  ),
                  const SizedBox(height: 3),
                  Text(
                    description,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF64748B),
                      height: 1.25,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    metaInfo,
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF9C3),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      rewardBadge,
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF854D0E),
                      ),
                    ),
                  ),
                ],
              ),
            ),

            const Icon(
              Icons.arrow_forward_ios_rounded,
              size: 14,
              color: Color(0xFFCBD5E1),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildBottomNav(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: const Color(0xFFE2E8F0).withOpacity(0.6), width: 1),
        ),
      ),
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildNavItem(Icons.home_rounded, 'Bosh sahifa', false, () => context.go('/kids/home')),
          _buildNavItem(Icons.sports_esports_rounded, 'O‘yinlar', true, () {}),
          _buildNavItem(Icons.bar_chart_rounded, 'Natijalar', false, () => context.go('/kids/analytics')),
          _buildNavItem(Icons.person_rounded, 'Profil', false, () => context.go('/kids/profile')),
        ],
      ),
    );
  }

  Widget _buildNavItem(IconData icon, String label, bool isActive, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              decoration: BoxDecoration(
                color: isActive ? const Color(0xFFEDE9FE) : Colors.transparent,
                borderRadius: BorderRadius.circular(14),
              ),
              child: Icon(
                icon,
                color: isActive ? const Color(0xFF6B42F5) : const Color(0xFF94A3B8),
                size: 22,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: isActive ? FontWeight.w800 : FontWeight.w500,
                color: isActive ? const Color(0xFF6B42F5) : const Color(0xFF94A3B8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
