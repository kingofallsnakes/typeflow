# TYPEFLOW roadmap

## Done
- Design system (dark default, light theme, finger colour tokens)
- Keyboard engine: US QWERTY layout, physical `KeyboardEvent.code` mapping, finger mapping
- Typing engine (framework-free): per-character states, backspace/correction handling, pause on blur,
  error classification (wrong key, shift error, repeated error, hesitation, slow transition)
- Metrics: WPM, CPM, accuracy, error rate, backspace rate, consistency
- Adaptive engine: mastery scoring with sample-size confidence, skill states, priority selection,
  weak-key and weak-transition drill generation
- Local persistence of sessions, skill profile, lesson progress and settings
- Screens: landing, dashboard, learn course, lesson, weakness/speed/accuracy/free practice,
  timed tests, progress charts, statistics tables, achievements, settings
- 18 unit tests for engine + adaptive algorithms (`npm run test`)

## Open (needs backend enabled)
- Accounts: sign-up, login, password reset, protected routes
- Cloud database with row-level security for profiles, sessions, key/transition stats
- Sync queue: batch upload of offline sessions, duplicate handling
- Admin panel: course/lesson/exercise management, user overview
- Onboarding flow with initial assessment and layout choice
- IndexedDB storage layer (currently local device storage)
- Sound profiles, extra keyboard layouts and languages
