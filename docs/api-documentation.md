# MathCity AI — REST API Documentation

Base URL: `http://localhost:4000/api`

## Authentication & Onboarding
- `POST /api/eligibility/check`: Public pre-check for DOB. Returns `{ eligible, age, mode: 'KIDS'|'TEEN'|null, message }`.
- `POST /api/auth/register`: Creates student account. Enforces DOB verification. Rejects 17+ or <6.
- `POST /api/auth/login`: Authenticates student.
- `GET /api/auth/me`: Returns authenticated student profile, coins, XP, city state.

## Curriculum & Learning
- `GET /api/lessons`: List lessons filtered by mode (`KIDS` or `TEEN`) and grade.
- `GET /api/lessons/:id`: Get full lesson overview, markdown explanation, LaTeX formulas, questions.
- `POST /api/lessons/:id/complete`: Complete lesson, awards +50 coins, +50 XP transactionally.
- `POST /api/practice/submit`: Submit question answer. Validated by MathEngine. Awards +5 coins, +10 XP.

## Educational Games
- `GET /api/games`: List math games (Kosmik hisob, etc.).
- `GET /api/games/kosmik-hisob/question?level=1`: Generates procedural space math questions.
- `POST /api/games/kosmik-hisob/result`: Submits score, awards coins and XP.

## Ziyo AI Math Tutor
- `POST /api/ai/chat`: Multi-step math tutoring in natural Uzbek (`O'zbek tili`).
  - Supports `action`: `chat`, `next_step` (Figma 2:563), `explain_more`, `similar_example`, `check_solution`.

## Mening Shahrim (City Builder)
- `GET /api/city`: Get student's city grid, placed buildings, level.
- `GET /api/city/shop`: List buildings, prices in gold coins, unlock requirements.
- `POST /api/city/purchase`: Atomically deducts gold coins, adds building, places on grid coordinate. (Observatory completion triggers Figma 2:712 celebration).

## Rewards & Progression
- `GET /api/coins/balance`: Current gold coins wallet balance.
- `GET /api/xp`: Total XP, current level, progress towards next level.
- `GET /api/tasks`: List daily learning tasks with live completion counters.
- `POST /api/tasks/:key/claim`: Claim task rewards (+coins, +XP).
- `GET /api/achievements`: Badges and milestones with unlock status.
- `GET /api/analytics`: Accuracy %, weekly activity bars, topic mastery percentages, review recommendations.
