import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../core/widgets/coin_badge.dart';
import '../../core/widgets/xp_bar.dart';
import '../../shared/providers/student_provider.dart';

class KidsHomeScreen extends ConsumerWidget {
  const KidsHomeScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final studentState = ref.watch(studentProvider);
    final student = studentState.student;

    final coins = student?.coinBalance ?? 100;
    final xp = student?.totalXP ?? 0;
    final level = student?.level ?? 1;
    final name = (student != null && student.displayName.trim().isNotEmpty) ? student.displayName.trim() : 'O‘quvchi';
    final cityLevel = student?.cityLevel ?? 1;

    // Soft Lavender background (Exact reference design: #F7F7FD)
    const backgroundColor = Color(0xFFF7F7FD);

    return Scaffold(
      backgroundColor: backgroundColor,
      body: SafeArea(
        child: SingleChildScrollView(
          physics: const BouncingScrollPhysics(),
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // ==============================================================
              // 1. TOP HEADER (Student Avatar, Greeting, Gold Pill Coin Badge)
              // ==============================================================
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Expanded(
                    child: Row(
                      children: [
                        // Avatar with elegant purple outline
                        Container(
                          width: 48,
                          height: 48,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            color: Colors.white,
                            border: Border.all(color: const Color(0xFF6C5CE7), width: 2.2),
                            boxShadow: [
                              BoxShadow(
                                color: const Color(0xFF6C5CE7).withOpacity(0.12),
                                blurRadius: 10,
                                offset: const Offset(0, 3),
                              ),
                            ],
                          ),
                          child: const Center(
                            child: Icon(
                              Icons.face_rounded,
                              color: Color(0xFF6C5CE7),
                              size: 30,
                            ),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                'Salom, $name! 👋',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w900,
                                  color: Color(0xFF1E1B4B),
                                  letterSpacing: -0.2,
                                ),
                              ),
                              const SizedBox(height: 2),
                              const Text(
                                'Bugun nima o‘rganamiz?',
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                  color: Color(0xFF8B8BA7),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(width: 10),
                  // Real-time Gold Coin Pill Badge
                  CoinBadge(count: coins, size: 28),
                ],
              ),
              const SizedBox(height: 16),

              // ==============================================================
              // 2. XP PROGRESS CARD (Full width, rounded white container)
              // ==============================================================
              XPBar(currentXP: xp, level: level),
              const SizedBox(height: 18),

              // ==============================================================
              // 3. MAIN HERO PURPLE LESSON CARD ("DAVOM ETISH")
              // ==============================================================
              Container(
                width: double.infinity,
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(38),
                  gradient: const LinearGradient(
                    colors: [
                      Color(0xFF6D52F7),
                      Color(0xFF8672FF),
                      Color(0xFF9886FE),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF7154EC).withOpacity(0.38),
                      blurRadius: 26,
                      offset: const Offset(0, 12),
                    ),
                  ],
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(38),
                  child: Stack(
                    children: [
                      // Decorative abstract fluid curves
                      Positioned.fill(
                        child: CustomPaint(
                          painter: _LessonCardCurvesPainter(),
                        ),
                      ),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 26),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Top Row: "DAVOM ETISH" pill badge and graduation cap
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                  decoration: BoxDecoration(
                                    color: Colors.white.withOpacity(0.24),
                                    borderRadius: BorderRadius.circular(999),
                                  ),
                                  child: const Text(
                                    'DAVOM ETISH',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.w800,
                                      fontSize: 11,
                                      letterSpacing: 1.1,
                                    ),
                                  ),
                                ),
                                const Icon(
                                  Icons.school_rounded,
                                  color: Colors.white,
                                  size: 26,
                                ),
                              ],
                            ),
                            const SizedBox(height: 18),

                            // Lesson Title & Subtitle
                            const Text(
                              'Oddiy kasrlar',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 24,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.3,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              'Butunning bo‘laklari va doirali diagrammalar',
                              style: TextStyle(
                                color: Colors.white.withOpacity(0.9),
                                fontSize: 13,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(height: 22),

                            // White Pill Button: "Darsni boshlash →"
                            ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: Colors.white,
                                foregroundColor: const Color(0xFF6C5CE7),
                                elevation: 0,
                                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(999),
                                ),
                              ),
                              onPressed: () {
                                context.push('/kids/lesson/lesson-g5-01');
                              },
                              child: const FittedBox(
                                fit: BoxFit.scaleDown,
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Text(
                                      'Darsni boshlash',
                                      style: TextStyle(
                                        fontWeight: FontWeight.w800,
                                        fontSize: 14,
                                        color: Color(0xFF6C5CE7),
                                      ),
                                    ),
                                    SizedBox(width: 8),
                                    Icon(
                                      Icons.arrow_forward_rounded,
                                      size: 18,
                                      color: Color(0xFF6C5CE7),
                                    ),
                                  ],
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // ==============================================================
              // 4. TWO FEATURE CARDS: "Mening shahrim" & "Kosmik hisob"
              // ==============================================================
              Row(
                children: [
                  // Card 1: Mening shahrim
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/kids/city'),
                      borderRadius: BorderRadius.circular(32),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32),
                          border: Border.all(color: const Color(0xFFEFF0FA), width: 1.2),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF7154EC).withOpacity(0.04),
                              blurRadius: 18,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Mint container with green building icon
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: const Color(0xFFE2FBE8),
                                borderRadius: BorderRadius.circular(18),
                              ),
                              child: const Center(
                                child: Icon(
                                  Icons.domain_rounded,
                                  color: Color(0xFF0F9D58),
                                  size: 26,
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),
                            const Text(
                              'Mening shahrim',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1E1B4B),
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '$cityLevel-daraja shahar',
                              style: const TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF8B8BA7),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),

                  // Card 2: Kosmik hisob
                  Expanded(
                    child: InkWell(
                      onTap: () => context.push('/kids/games/space-math'),
                      borderRadius: BorderRadius.circular(32),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 20),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(32),
                          border: Border.all(color: const Color(0xFFEFF0FA), width: 1.2),
                          boxShadow: [
                            BoxShadow(
                              color: const Color(0xFF7154EC).withOpacity(0.04),
                              blurRadius: 18,
                              offset: const Offset(0, 6),
                            ),
                          ],
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            // Peach container with rocket icon
                            Container(
                              width: 48,
                              height: 48,
                              decoration: BoxDecoration(
                                color: const Color(0xFFFEE8DC),
                                borderRadius: BorderRadius.circular(18),
                              ),
                              child: const Center(
                                child: Icon(
                                  Icons.rocket_launch_rounded,
                                  color: Color(0xFFEA580C),
                                  size: 26,
                                ),
                              ),
                            ),
                            const SizedBox(height: 14),
                            const Text(
                              'Kosmik hisob',
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1E1B4B),
                              ),
                            ),
                            const SizedBox(height: 4),
                            const Text(
                              '+30 oltin tanga',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFFD97706),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),

              // ==============================================================
              // 5. ZIYO AI USTOZ CARD (Soft Lavender background & purple robot)
              // ==============================================================
              InkWell(
                onTap: () => context.push('/kids/ai-tutor'),
                borderRadius: BorderRadius.circular(32),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF2F0FF),
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(color: const Color(0xFFE6E2FF), width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF7154EC).withOpacity(0.04),
                        blurRadius: 16,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      // Solid purple circle with white robot icon
                      Container(
                        width: 46,
                        height: 46,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          color: Color(0xFF6C5CE7),
                        ),
                        child: const Center(
                          child: Icon(
                            Icons.smart_toy_rounded,
                            color: Colors.white,
                            size: 24,
                          ),
                        ),
                      ),
                      const SizedBox(width: 14),
                      const Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'AI Ustoz',
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF1E1B4B),
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Tushunmagan misolingiz bormi? So‘rang!',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                                color: Color(0xFF8B8BA7),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const Icon(
                        Icons.chat_bubble_outline_rounded,
                        color: Color(0xFF6C5CE7),
                        size: 22,
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),

              // ==============================================================
              // 6. BUGUNGI VAZIFALAR (Large white rounded card with mint badge)
              // ==============================================================
              InkWell(
                onTap: () => context.push('/kids/daily-tasks'),
                borderRadius: BorderRadius.circular(32),
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(32),
                    border: Border.all(color: const Color(0xFFEFF0FA), width: 1.2),
                    boxShadow: [
                      BoxShadow(
                        color: const Color(0xFF7154EC).withOpacity(0.04),
                        blurRadius: 18,
                        offset: const Offset(0, 6),
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Expanded(
                            child: Row(
                              children: [
                                Icon(
                                  Icons.checklist_rounded,
                                  color: Color(0xFF0F9D58),
                                  size: 22,
                                ),
                                SizedBox(width: 8),
                                Expanded(
                                  child: Text(
                                    'Bugungi vazifalar',
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      color: Color(0xFF1E1B4B),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Mint Pill Progress Badge
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                            decoration: BoxDecoration(
                              color: const Color(0xFFD4F8E6),
                              borderRadius: BorderRadius.circular(999),
                            ),
                            child: const Text(
                              '1 / 4 bajarildi',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F9D58),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 10),
                      const Text(
                        '5 ta matematika masalasini to‘g‘ri yeching',
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w500,
                          color: Color(0xFF4B5563),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 24),
            ],
          ),
        ),
      ),
      // ==============================================================
      // 7. FLOATING BOTTOM NAVIGATION BAR (Exact reference design)
      // ==============================================================
      bottomNavigationBar: _buildFloatingBottomNav(context, 0),
    );
  }

  Widget _buildFloatingBottomNav(BuildContext context, int activeIndex) {
    return Container(
      margin: const EdgeInsets.only(left: 16, right: 16, bottom: 14),
      padding: const EdgeInsets.symmetric(vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(38),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF7154EC).withValues(alpha: 0.08),
            blurRadius: 24,
            offset: const Offset(0, 6),
          ),
        ],
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Expanded(
            child: _navItem(
              icon: Icons.home_rounded,
              label: 'Bosh sahifa',
              isSelected: activeIndex == 0,
              onTap: () => context.go('/kids/home'),
            ),
          ),
          Expanded(
            child: _navItem(
              icon: Icons.menu_book_rounded,
              label: 'Xarita',
              isSelected: activeIndex == 1,
              onTap: () => context.push('/kids/lessons'),
            ),
          ),
          Expanded(
            child: _navItem(
              icon: Icons.sports_esports_rounded,
              label: 'O‘yinlar',
              isSelected: activeIndex == 2,
              onTap: () => context.push('/kids/games'),
            ),
          ),
          Expanded(
            child: _navItem(
              icon: Icons.domain_rounded,
              label: 'Shahrim',
              isSelected: activeIndex == 3,
              onTap: () => context.push('/kids/city'),
            ),
          ),
          Expanded(
            child: _navItem(
              icon: Icons.person_rounded,
              label: 'Profil',
              isSelected: activeIndex == 4,
              onTap: () => context.push('/kids/profile'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _navItem({
    required IconData icon,
    required String label,
    required bool isSelected,
    required VoidCallback onTap,
  }) {
    final color = isSelected ? const Color(0xFF6C5CE7) : const Color(0xFF9CA3AF);

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 6),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              color: color,
              size: 24,
            ),
            const SizedBox(height: 3),
            FittedBox(
              fit: BoxFit.scaleDown,
              child: Text(
                label,
                maxLines: 1,
                style: TextStyle(
                  fontSize: 11,
                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                  color: color,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// Abstract curves painter to replicate the fluid purple waves on the lesson card
class _LessonCardCurvesPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    // Upper right subtle curve
    final p1 = Paint()
      ..color = Colors.white.withOpacity(0.08)
      ..style = PaintingStyle.fill;
    final path1 = Path();
    path1.moveTo(size.width * 0.45, 0);
    path1.quadraticBezierTo(
      size.width * 0.72,
      size.height * 0.42,
      size.width,
      size.height * 0.28,
    );
    path1.lineTo(size.width, 0);
    path1.close();
    canvas.drawPath(path1, p1);

    // Bottom right subtle curve
    final p2 = Paint()
      ..color = Colors.white.withOpacity(0.06)
      ..style = PaintingStyle.fill;
    final path2 = Path();
    path2.moveTo(size.width * 0.52, size.height);
    path2.quadraticBezierTo(
      size.width * 0.76,
      size.height * 0.62,
      size.width,
      size.height * 0.76,
    );
    path2.lineTo(size.width, size.height);
    path2.close();
    canvas.drawPath(path2, p2);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
