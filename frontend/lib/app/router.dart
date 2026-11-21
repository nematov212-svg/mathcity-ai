import 'package:go_router/go_router.dart';
import '../core/responsive/responsive_layout.dart';
import '../features/splash/splash_screen.dart';
import '../features/auth/login_screen.dart';
import '../features/auth/register_screen.dart';
import '../features/auth/forgot_password_screen.dart';
import '../features/auth/complete_profile_screen.dart';
import '../features/onboarding/welcome_screen.dart';
import '../features/onboarding/intro_screen.dart';
import '../features/age_eligibility/access_denied_screen.dart';
import '../features/home/kids_home_screen.dart';
import '../features/home/kids_desktop_screen.dart';
import '../features/home/teen_home_screen.dart';
import '../features/home/teen_desktop_screen.dart';
import '../features/lessons/lessons_screen.dart';
import '../features/lessons/lesson_map_screen.dart';
import '../features/lessons/lesson_reader_screen.dart';
import '../features/lessons/lesson_complete_screen.dart';
import '../features/lessons/teen_course_map_screen.dart';
import '../features/practice/exercise_screen.dart';
import '../features/games/games_hub_screen.dart';
import '../features/games/space_math_game_screen.dart';
import '../features/games/fraction_battle_game_screen.dart';
import '../features/games/game_result_screen.dart';
import '../features/ai_teacher/ziyo_tutor_screen.dart';
import '../features/ai_teacher/teen_ziyo_tutor_screen.dart';
import '../features/city/teen_city_screen.dart';
import '../features/daily_tasks/daily_tasks_screen.dart';
import '../features/achievements/achievements_screen.dart';
import '../features/analytics/analytics_screen.dart';
import '../features/analytics/teen_analytics_screen.dart';
import '../features/profile/profile_screen.dart';
import '../features/settings/settings_screen.dart';
import '../features/settings/mathcity_pro_screen.dart';
import '../features/payment/add_payment_screen.dart';
import '../features/leaderboard/leaderboard_screen.dart';

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
    // Kids Mode Routes
    
    GoRoute(
      path: '/kids/home',
      builder: (context, state) => const ResponsiveLayout(
        mobile: KidsHomeScreen(),
        desktop: KidsDesktopScreen(),
      ),
    ),
    GoRoute(
      path: '/kids/lessons',
      builder: (context, state) => const LessonsScreen(),
    ),
    GoRoute(
      path: '/kids/lesson-map',
      builder: (context, state) => const LessonMapScreen(),
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
      path: '/kids/leaderboard',
      builder: (context, state) => const LeaderboardScreen(),
    ),
    GoRoute(
      path: '/kids/games',
      builder: (context, state) => const GamesHubScreen(),
    ),
    GoRoute(
      path: '/kids/games/space-math',
      builder: (context, state) => const SpaceMathGameScreen(),
    ),
    GoRoute(
      path: '/kids/games/fraction-battle',
      builder: (context, state) => const FractionBattleGameScreen(),
    ),
    GoRoute(
      path: '/kids/games/result',
      builder: (context, state) => GameResultScreen(
        resultData: state.extra as Map<String, dynamic>?,
      ),
    ),
    GoRoute(
      path: '/kids/ai-tutor',
      builder: (context, state) => const ZiyoTutorScreen(),
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
    GoRoute(
      path: '/kids/profile',
      builder: (context, state) => const ProfileScreen(),
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
      path: '/tariflar',
      builder: (context, state) => const MathCityProScreen(),
    ),
    GoRoute(
      path: '/pro',
      builder: (context, state) => const MathCityProScreen(),
    ),
    GoRoute(
      path: '/payment/add',
      builder: (context, state) => const AddPaymentScreen(),
    ),
  ],
);
