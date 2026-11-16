class ApiEndpoints {
  static const String health = '/health';
  static const String checkEligibility = '/eligibility/check';
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String me = '/auth/me';

  static const String lessons = '/lessons';
  static String lessonDetail(String id) => '/lessons/$id';
  static String completeLesson(String id) => '/lessons/$id/complete';

  static const String submitPractice = '/practice/submit';

  static const String games = '/games';
  static const String spaceMathQuestion = '/games/kosmik-hisob/question';
  static const String spaceMathResult = '/games/kosmik-hisob/result';

  static const String aiChat = '/ai/chat';

  static const String city = '/city';
  static const String cityShop = '/city/shop';
  static const String cityPurchase = '/city/purchase';

  static const String coinBalance = '/coins/balance';
  static const String xp = '/xp';
  static const String tasks = '/tasks';
  static String claimTask(String key) => '/tasks/$key/claim';
  static const String achievements = '/achievements';
  static const String analytics = '/analytics';
  static const String profile = '/students/profile';
}
