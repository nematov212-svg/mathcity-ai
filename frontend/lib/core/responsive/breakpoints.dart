/// Responsive layout breakpoints and content width constraints for MathCity AI
class Breakpoints {
  Breakpoints._();

  /// Below this breakpoint (or when shortestSide < 500), the app renders the
  /// exact compact (phone) layout without alteration.
  static const double compact = 600.0;

  /// Between [compact] and [medium] (600 <= width < 1024), the app renders the
  /// tablet (medium) layout.
  static const double medium = 1024.0;

  /// Content width constraints
  static const double maxContentWidth = 1200.0;
  static const double maxTextContentWidth = 720.0;
  static const double maxCardWidth = 720.0;
  static const double maxDialogWidth = 520.0;
  static const double maxStoreDialogWidth = 720.0;
  static const double maxWizardDialogWidth = 640.0;
  static const double maxTugOfWarWidth = 1280.0;
  static const double maxAuthCardWidth = 460.0;
  static const double maxProDialogWidth = 560.0;
}
