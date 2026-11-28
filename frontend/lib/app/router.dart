import 'package:go_router/go_router.dart';
import '../core/responsive/responsive_layout.dart';
import '../core/widgets/kids_shell_layout.dart';
import '../features/splash/splash_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/auth/forgot_password_screen.dart';
import '../features/auth/complete_profile_screen.dart';
import '../features/onboarding/welcome_screen.dart';
import '../features/onboarding/intro_screen.dart';
import '../features/age_eligibility/access_denied_screen.dart';
import '../features/home/kids_home_screen.dart';
import '../features/home/kids_tablet_screen.dart';
import '../features/home/kids_desktop_screen.dart';
import '../features/home/teen_home_screen.dart';
import '../features/home/teen_desktop_screen.dart';
import '../features/lessons/lessons_screen.dart';
import '../features/lessons/module_lessons_screen.dart';
import '../features/lessons/lesson_reader_screen.dart';
import '../features/lessons/lesson_complete_screen.dart';
import '../features/lessons/teen_course_map_screen.dart';
import '../features/practice/exercise_screen.dart';
import '../features/games/games_hub_screen.dart';
import '../features/games/house_building_screen.dart';
import '../features/games/fraction_battle_game_screen.dart';
import '../features/games/drift_car_game_screen.dart';
import '../features/games/game_result_screen.dart';
import '../features/games/screens/tug_of_war_screen.dart';
import '../features/games/speed_math/speed_math_screen.dart';
import '../features/games/memory_cards/memory_cards_screen.dart';
import '../features/games/number_maze/number_maze_screen.dart';
import '../features/games/math_duel/math_duel_screen.dart';
import '../features/games/models/game_config.dart';
import '../features/ai_teacher/ziyo_tutor_screen.dart';
import '../features/ai_teacher/teen_ziyo_tutor_screen.dart';
import '../features/city/teen_city_screen.dart';
import '../features/daily_tasks/daily_tasks_screen.dart';
import '../features/achievements/achievements_screen.dart';
import '../features/analytics/analytics_screen.dart';
import '../features/analytics/teen_analytics_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/settings/certificate_screen.dart';
import '../features/settings/mathcity_pro_screen.dart';
import '../features/payment/add_payment_screen.dart';
import '../features/leaderboard/leaderboard_screen.dart';
import '../features/legal/privacy_policy_screen.dart';

final GoRouter appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/register',
      builder: (context, state) => const RegisterScreen(),
    ),
    GoRoute(
      path: '/auth/forgot-password',
      builder: (context, state) => const ForgotPasswordScreen(),
    ),
    GoRoute(
      path: '/complete-profile',
      builder: (context, state) => const CompleteProfileScreen(),
    ),
    GoRoute(
      path: '/onboarding/complete-profile',
      builder: (context, state) => const CompleteProfileScreen(),
    ),
    GoRoute(
      path: '/welcome',
      builder: (context, state) => const WelcomeScreen(),
    ),
    GoRoute(
      path: '/onboarding/intro',
      builder: (context, state) => const IntroScreen(),
    ),
    GoRoute(
      path: '/access-denied',
      builder: (context, state) => const AccessDeniedScreen(),
    ),
    // Kids Primary 5-Tab Persistent Navigation Shell (No-flicker glassmorphic bottom bar)
    ShellRoute(
      builder: (context, state, child) => KidsShellLayout(child: child),
      routes: [
        GoRoute(
          path: '/kids/home',
          builder: (context, state) => const ResponsiveLayout(
            mobile: KidsHomeScreen(),
            tablet: KidsTabletScreen(),
            desktop: KidsDesktopScreen(),
          ),
        ),
        GoRoute(
          path: '/kids/lessons',
          builder: (context, state) => const LessonsScreen(),
        ),
        GoRoute(
          path: '/kids/ai-tutor',
          builder: (context, state) => const ZiyoTutorScreen(),
        ),
        GoRoute(
          path: '/kids/leaderboard',
          builder: (context, state) => const LeaderboardScreen(),
        ),
        GoRoute(
          path: '/kids/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    ),
    // Kids Mode Sub-Routes
    GoRoute(
      path: '/kids/lessons/module/:id',
      builder: (context, state) => ModuleLessonsScreen(
        moduleId: state.pathParameters['id'] ?? 'module-g1-p1',
      ),
    ),
    GoRoute(
      path: '/kids/lesson/:id',
      builder: (context, state) => LessonReaderScreen(
        lessonId: state.pathParameters['id'] ?? 'lesson-k4-01',
      ),
    ),
    GoRoute(
      path: '/kids/exercise/:id',
      builder: (context, state) => ExerciseScreen(
        questionId: state.pathParameters['id'],
        lessonId: state.uri.queryParameters['lessonId'],
        sectionId: state.uri.queryParameters['sectionId'],
      ),
    ),
    GoRoute(
      path: '/kids/exercise',
      builder: (context, state) => ExerciseScreen(
        lessonId: state.uri.queryParameters['lessonId'],
        sectionId: state.uri.queryParameters['sectionId'],
      ),
    ),
    GoRoute(
      path: '/kids/lesson-complete',
      builder: (context, state) => const LessonCompleteScreen(),
    ),
    GoRoute(
      path: '/kids/games',
      builder: (context, state) => const GamesHubScreen(),
    ),
    GoRoute(
      path: '/kids/house-building',
      builder: (context, state) => const HouseBuildingScreen(),
    ),
    GoRoute(
      path: '/kids/games/house-building',
      builder: (context, state) => const HouseBuildingScreen(),
    ),
    GoRoute(
      path: '/kids/games/fraction-battle',
      builder: (context, state) => const FractionBattleGameScreen(),
    ),
    GoRoute(
      path: '/kids/games/drift-car',
      builder: (context, state) => const DriftCarGameScreen(),
    ),
    GoRoute(
      path: '/games/tug-of-war',
      builder: (context, state) => TugOfWarScreen(
        config: state.extra is GameConfig
            ? state.extra as GameConfig
            : const GameConfig(),
      ),
    ),
    GoRoute(
      path: '/kids/games/tug-of-war',
      builder: (context, state) => TugOfWarScreen(
        config: state.extra is GameConfig
            ? state.extra as GameConfig
            : const GameConfig(),
      ),
    ),
    GoRoute(
      path: '/kids/games/speed-math',
      builder: (context, state) => const SpeedMathScreen(),
    ),
    GoRoute(
      path: '/kids/games/memory-cards',
      builder: (context, state) => const MemoryCardsScreen(),
    ),
    GoRoute(
      path: '/kids/games/number-maze',
      builder: (context, state) => const NumberMazeScreen(),
    ),
    GoRoute(
      path: '/kids/games/math-duel',
      builder: (context, state) => const MathDuelScreen(),
    ),
    GoRoute(
      path: '/kids/games/result',
      builder: (context, state) => GameResultScreen(
        resultData: state.extra as Map<String, dynamic>?,
      ),
    ),
    GoRoute(
      path: '/kids/city',
      redirect: (context, state) => '/kids/home',
    ),
    GoRoute(
      path: '/kids/daily-tasks',
      builder: (context, state) => const DailyTasksScreen(),
    ),
    GoRoute(
      path: '/kids/achievements',
      builder: (context, state) => const AchievementsScreen(),
    ),
    GoRoute(
      path: '/kids/analytics',
      builder: (context, state) => const AnalyticsScreen(),
    ),
    // Teen Mode Routes
    GoRoute(
      path: '/teen/home',
      builder: (context, state) => const ResponsiveLayout(
        mobile: TeenHomeScreen(),
        desktop: TeenDesktopScreen(),
      ),
    ),
    GoRoute(
      path: '/teen/courses',
      builder: (context, state) => const TeenCourseMapScreen(),
    ),
    GoRoute(
      path: '/teen/ai-tutor',
      builder: (context, state) => const TeenZiyoTutorScreen(),
    ),
    GoRoute(
      path: '/teen/city',
      builder: (context, state) => const TeenCityScreen(),
    ),
    GoRoute(
      path: '/teen/analytics',
      builder: (context, state) => const TeenAnalyticsScreen(),
    ),
    // Settings & Tariflar (Shared)
    GoRoute(
      path: '/settings',
      builder: (context, state) => const SettingsScreen(),
    ),
    GoRoute(
      path: '/settings/certificate',
      builder: (context, state) => const CertificateScreen(),
    ),
    GoRoute(
      path: '/kids/pro',
      builder: (context, state) {
        final plan = state.uri.queryParameters['plan'] ??
            (state.extra is Map
                ? (state.extra as Map)['selectedPlan']?.toString()
                : null);
        return MathCityProScreen(initialPlan: plan);
      },
    ),
    GoRoute(
      path: '/tariflar',
      builder: (context, state) {
        final plan = state.uri.queryParameters['plan'] ??
            (state.extra is Map
                ? (state.extra as Map)['selectedPlan']?.toString()
                : null);
        return MathCityProScreen(initialPlan: plan);
      },
    ),
    GoRoute(
      path: '/pro',
      builder: (context, state) {
        final plan = state.uri.queryParameters['plan'] ??
            (state.extra is Map
                ? (state.extra as Map)['selectedPlan']?.toString()
                : null);
        return MathCityProScreen(initialPlan: plan);
      },
    ),
    GoRoute(
      path: '/payment/add',
      builder: (context, state) => const AddPaymentScreen(),
    ),
    // Public Legal & Compliance Routes (Unauthenticated access)
    GoRoute(
      path: '/privacy-policy',
      builder: (context, state) => const PrivacyPolicyScreen(),
    ),
    GoRoute(
      path: '/privacy',
      builder: (context, state) => const PrivacyPolicyScreen(),
    ),
  ],
);
