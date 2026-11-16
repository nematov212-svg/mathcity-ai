# MathCity AI — Figma Screen Map

This document maps every official Figma frame from file key `6RAN0OcHeBGZGdoNgVU33G` (node `0:1`) to its corresponding Flutter route, widget, and state implementation.

| # | Screen Name | Figma Node ID | Target Audience | Flutter Screen / Route | Description & Key Components |
|---|-------------|---------------|-----------------|------------------------|------------------------------|
| 01 | Xush kelibsiz | `2:2` | All / New Users | `/welcome` | Brand splash & welcome screen, 3D math city illustration, CTA button |
| 02 | O‘zingizni tanishtiring | `2:6` | All / Onboarding | `/onboarding/intro` | Name, Date of Birth selection, automated age eligibility check & mode routing |
| 03 | Bolalar bosh sahifasi | `2:10` | Kids (6–12) | `/kids/home` | Personalized greeting, coin balance, daily adventure, continue lesson, city preview, bottom bar |
| 04 | Darslar xaritasi | `2:14` | Kids (6–12) | `/kids/lessons` | Interactive mathematics learning path (fractions roadmap, milestone nodes, unlock states) |
| 05 | Yangi mavzu | `2:18` | Kids (6–12) | `/kids/lesson/:id` | Lesson reader (e.g. Oddiy kasrlar), fractions visuals, AI tips, continue action |
| 06 | Mashq | `2:22` | Kids (6–12) | `/kids/exercise/:id` | Interactive question engine, fraction pie visual, answer choices, instant validation |
| 07 | Dars yakuni | `2:26` | Kids (6–12) | `/kids/lesson-complete` | Lesson celebration, accuracy summary, +XP and +Gold Coins animated awards |
| 08 | O‘yinlar | `2:30` | Kids (6–12) | `/kids/games` | Math games hub, game cards with difficulty levels and coin rewards |
| 09 | Kosmik hisob | `2:34` | Kids (6–12) | `/kids/games/space-math` | Space-themed arithmetic challenge with time, questions, score, interactive choices |
| 10 | Ziyo AI Ustoz | `2:38` | Kids (6–12) | `/kids/ai-tutor` | Friendly AI mascot Ziyo, voice/camera actions, step-by-step kid-friendly math tutor |
| 11 | Mening shahrim | `2:42` | Kids (6–12) | `/kids/city` | Interactive city builder grid, clickable plots, current buildings, gold coin balance |
| 12 | Qurilish do‘koni | `2:46` | Kids (6–12) | `/kids/city/shop` | Building store with prices in gold coins, purchase modal, inventory checks |
| 13 | Kunlik vazifalar | `2:50` | Kids (6–12) | `/kids/daily-tasks` | Daily quests, task progress bars, coin and XP claim actions |
| 14 | Yutuqlar | `2:54` | Kids (6–12) | `/kids/achievements` | Badges, locked/unlocked milestones, reward claims (gold coins, not stars) |
| 15 | Mening natijalarim | `2:58` | Kids (6–12) | `/kids/analytics` | Learning stats, accuracy %, weekly activity chart, topic mastery breakdown |
| 16 | Mening profilim | `2:62` | Kids (6–12) | `/kids/profile` | Student avatar, grade, level, XP progress, coin balance, badge showcase |
| 17 | Sozlamalar | `2:66` | Kids & Teen | `/settings` | Language (Uzbek), sound effects, animations toggle, account details, logout |
| 18 | O‘smirlar bosh sahifasi | `2:70` | Teen (13–16) | `/teen/home` | Dark theme (#101526), lime-green accent (#C7FA74), advanced courses, goals |
| 19 | O‘smirlar o‘quv yo‘li | `2:74` | Teen (13–16) | `/teen/courses` | Algebra, Geometry, Functions modules, mastery levels, prerequisite paths |
| 20 | O‘smirlar AI Ustoz | `2:78` | Teen (13–16) | `/teen/ai-tutor` | Mathematical LaTeX solver, LaTeX rendering, equation breakdowns, hints |
| 21 | O‘smirlar natijalar | `2:82` | Teen (13–16) | `/teen/analytics` | Topic mastery analytics, strength & weakness vectors, recommended practice |
| 22 | O‘smirlar shahar | `2:86` | Teen (13–16) | `/teen/city` | Modern sci-fi metropolis style, high-tech research labs and observatories |
| 23 | Bolalar keng ekran | `2:90` | Kids (6–12) | Responsive Desktop | Adaptive layout >= 1024px with persistent left rail, wider lesson workspace |
| 24 | O‘smirlar keng ekran | `2:91` | Teen (13–16) | Responsive Desktop | Dark desktop dashboard with wide telemetry charts, split AI tutor console |
| 25 | Dizayn tizimi & harakat | `2:92` | System | Design Tokens | Color palettes, typography (Nunito & Inter), shadows, radius, animations |
| 26 | Tasvirlar to‘plami | `2:93` | System | Asset Bundle | 3D characters, Ziyo robot, gold coin assets, building models, space objects |
| 27 | Yana urinib ko‘r | `2:332` | Kids (6–12) | Dialog / Exercise State | Error explanation card, visual hint, retry button |
| 28 | Kosmik hisob: To‘g‘ri | `2:463` | Kids (6–12) | Game Feedback Overlay | Correct answer green burst, combo counter, bonus coins |
| 29 | Kosmik hisob: Qayta | `2:495` | Kids (6–12) | Game Feedback Overlay | Incorrect answer feedback, shield lost indicator, retry question |
| 30 | Ziyo: Keyingi qadam | `2:563` | AI Tutor | AI Step Card | Interactive step reveal ("Keyingi qadam", "Batafsil tushuntir", "O'xshash misol") |
| 31 | Rasadxona qurildi | `2:712` | City Builder | Construction Celebration | Observatory completion modal, animation reveal, +city level bonus |
| 32 | Yosh cheklovi | Custom (Strict Rule) | 17+ | `/access-denied` | Access denied: "MathCity AI faqat 16 yoshgacha bo‘lgan o‘quvchilar uchun..." |
