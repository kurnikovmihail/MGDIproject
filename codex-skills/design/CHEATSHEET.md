# CHEATSHEET

Create UI:
→ use impeccable craft

Improve:
→ /polish

Check:
→ /audit

General:
→ always say "follow README rules"
  

   #когда создаешь что то новое
  - Следуй правилам из my-codex-skills-test1/README.md.
Сделай hero-блок для премиального сервиса доставки еды.
Нужен современный, не шаблонный интерфейс.
Если сайт должен быть:

спокойнее и чище — понижаешь DESIGN_VARIANCE
более живым — повышаешь MOTION_INTENSITY
более “воздушным” — понижаешь VISUAL_DENSITY
более насыщенным как dashboard — повышаешь VISUAL_DENSITY
Моя практическая настройка для сайтов

Для большинства красивых сайтов:

DESIGN_VARIANCE: 6–7
MOTION_INTENSITY: 4–6
VISUAL_DENSITY: 3–5

--------работа с impeccable

Используй постоянно
/impeccable teach — один раз в начале проекта
/impeccable craft — когда строишь интерфейс
 — когда хочешь понять, что сломано
/critique — когда хочешь понять, что скучно
/polish — когда уже почти готово
/layout — когда проблема в композиции

/typeset — когда проблема в шрифтах и иерархии
/animate — когда хочешь purposeful motion
/harden — когда нужен более production-ready UI
Используй реже
/distill — если слишком много лишнего
/clarify — если слабый UX-copy
/colorize — если нужен более выразительный цвет
/bolder — если дизайн пресный
/quieter — если слишком кричит
/adapt — если хочешь адаптацию под другой контекст/девайс
/overdrive — если нужен уже “вау”-эффект технического уровня

===========так же:
Тут важный момент: в документации impeccable прямо сказано, что Codex CLI использует другой синтаксис — /prompts:audit, /prompts:polish и так далее. То есть в зависимости от того, какой именно интерфейс у тебя в VS Code, slash-команды могут либо работать как есть, либо их нужно будет вызывать в codex-стиле, либо просто писать их смысл обычным текстом.

Поэтому используй такой безопасный принцип:

Если slash-команды работают

Пиши коротко:

/audit pricing section
/polish hero
/critique landing page
Если slash-команды не работают

Пиши смыслом:

Используй impeccable audit для pricing section.

или:

Проведи UX-критику landing page через impeccable.

или:

Сделай финальную полировку hero section как перед релизом.

Это не буквально прописано как гарантия для расширения VS Code, но это безопасный практический способ, если твоя оболочка не поддерживает slash-синтаксис напрямую. Основание тут в том, что документация сама разделяет синтаксис по harness’ам.

--------и на всякий: 

Как не запутаться: очень короткая шпаргалка
Если делаешь новый UI

README → taste фоном → impeccable craft → critique → polish

Если UI уже есть, но он слабый

README → critique → layout/typeset/bolder → polish

Если готовишь к продакшену

README → audit → harden → polish

Если речь про анимации

Сначала собери нормальный UI, потом design-motion-principles на аудит motion.


------РАБОТА С ПЛАНОМ

Как его использовать

Пример нормального сценария:

Шаг 1

Ты пишешь Codex:

Следуй правилам из codex-skills/design/README.md.
Сначала заполни codex-skills/design/WORKFLOW/IMPLEMENTATION_PLAN.md для этой задачи.
Не начинай правки, пока не составишь план.
Шаг 2

После этого:

Теперь выполняй задачу строго по плану из codex-skills/design/WORKFLOW/IMPLEMENTATION_PLAN.md.
После каждого завершённого этапа обновляй статусы:
- что сделано
- что в процессе
- что осталось
Шаг 3

Если хочешь сначала критику:

Используй critique / review-подход.
Сначала проанализируй текущий интерфейс.
Потом занеси план исправлений в codex-skills/design/WORKFLOW/IMPLEMENTATION_PLAN.md.
Только после этого переходи к правкам.