# ⚡ TYPEFLOW

<p align="center">
  <strong>Adaptive Typing Intelligence</strong><br/>
  <em>Measure how you type. Understand why you slow down. Train what actually matters.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/TanStack_Start-SSR-FF4154?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/AI-OpenRouter-8B5CF6" />
</p>

<p align="center">
  <strong>⌨️ Capture → 🧠 Analyze → 🎯 Adapt → 📈 Improve</strong>
</p>

---

## 🧬 Typing Is More Than WPM

Most typing applications give you a paragraph, measure your WPM, calculate accuracy, and stop there.

**TypeFlow goes deeper.**

Every keystroke becomes a signal.

TypeFlow analyzes:

* individual key performance
* key-to-key transitions
* hesitation patterns
* correction behavior
* typing rhythm
* finger movement
* speed consistency
* error frequency
* skill mastery
* skill decay
* historical performance

It then converts those signals into a continuously evolving **typing skill profile**.

Instead of giving everyone the same exercises, TypeFlow answers:

> **What is preventing this person from typing better right now?**

Then it trains that exact weakness.

---

# 🧠 The TypeFlow Intelligence Engine

```text
                    ┌─────────────────────┐
                    │    TYPING SESSION   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │  KEYSTROKE ENGINE   │
                    └──────────┬──────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
             KEYS        TRANSITIONS       TIMING
                │              │              │
                └──────────────┼──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │   SKILL ANALYSIS    │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ ADAPTIVE SCHEDULER  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ PERSONALIZED DRILL  │
                    └─────────────────────┘
```

### The core loop

```text
Type
 ↓
Measure
 ↓
Identify bottleneck
 ↓
Prioritize weakness
 ↓
Generate drill
 ↓
Practice
 ↓
Re-measure
 ↓
Update skill model
```

This makes TypeFlow a **closed-loop learning system**, rather than a collection of typing tests.

---

# 🔬 What TypeFlow Actually Learns

## Key-Level Mastery

Every key receives its own performance profile.

```text
E
├── Accuracy       98.4%
├── Average Time   142ms
├── Attempts       2,481
├── Confidence     0.94
├── Mastery        91/100
└── Status         MASTERED
```

The system considers both recent and historical performance instead of reacting to a single bad attempt.

---

## 🔗 Transition Intelligence

Typing problems aren't always caused by individual keys.

You may know:

```text
T = strong
H = strong
```

but still struggle with:

```text
T → H
```

TypeFlow tracks the interval between consecutive keys and identifies slow transitions.

Example:

```text
Normal

T ──125ms── H ──130ms── E ──128ms── R


Bottleneck

T ──125ms── H ──612ms── E
                 ▲
             bottleneck
```

This allows TypeFlow to distinguish between:

**Key weakness**

and

**Movement weakness.**

---

# ⏱️ Temporal Analysis

TypeFlow doesn't only care about *what* you typed.

It cares about **when** you typed it.

The engine detects:

* hesitation
* pauses
* timing spikes
* acceleration
* deceleration
* unstable rhythm
* slow transitions
* recovery time after mistakes

### Example

```text
Expected rhythm

120ms → 128ms → 124ms → 132ms → 126ms


Unstable rhythm

118ms → 141ms → 490ms → 119ms → 360ms
                  ▲               ▲
              hesitation      instability
```

---

# 🎯 Adaptive Training

TypeFlow doesn't randomly choose exercises.

Its adaptive engine ranks skills according to their expected training value.

Conceptually:

```text
Priority =
    Weakness
  × Usage Frequency
  × Error Cost
  × Recency
  × Confidence
  × Decay
```

The highest-impact skill becomes the next training target.

### Skill lifecycle

```text
DISCOVERED
    ↓
LEARNING
    ↓
DEVELOPING
    ↓
STABLE
    ↓
MASTERED
    ↓
DECAYING
    ↓
REVIEW
```

This creates continuous training instead of a fixed curriculum.

---

# 🩺 Typing Diagnosis

TypeFlow's goal isn't merely to say:

> **92 WPM**

It should explain **why** you are at 92 WPM.

### Example diagnosis

```text
╭──────────────────────────────────────╮
│          TYPING DIAGNOSIS             │
├──────────────────────────────────────┤
│                                      │
│  104 WPM Burst Speed                 │
│   81 WPM Sustained Speed             │
│                                      │
│  97.2% Key Accuracy                  │
│                                      │
│  PRIMARY BOTTLENECK                  │
│  H → E transition                   │
│                                      │
│  SECONDARY BOTTLENECK                │
│  Punctuation hesitation              │
│                                      │
│  RECOMMENDED                         │
│  4-minute transition drill           │
│                                      │
╰──────────────────────────────────────╯
```

This is the direction that makes TypeFlow different from conventional typing websites.

---

# 📊 Performance Intelligence

| Metric               | Meaning                             |
| -------------------- | ----------------------------------- |
| **Gross WPM**        | Raw typing speed                    |
| **Net WPM**          | Error-adjusted typing speed         |
| **CPM**              | Characters per minute               |
| **Accuracy**         | Correct keystrokes                  |
| **Consistency**      | Stability of typing speed           |
| **Error Rate**       | Errors relative to input            |
| **Backspace Rate**   | Correction frequency                |
| **Hesitation Rate**  | Frequency of long pauses            |
| **Transition Speed** | Key-to-key movement time            |
| **Correction Cost**  | Time spent recovering from mistakes |
| **Burst Speed**      | Short-term maximum performance      |
| **Sustained Speed**  | Long-duration performance           |
| **Rhythm Stability** | Temporal consistency                |

---

# 🔎 Error Intelligence

A mistake isn't simply `wrong`.

TypeFlow categorizes typing failures.

```text
WRONG_KEY
SHIFT_ERROR
REPEATED_MISTAKE
HESITATION
SLOW_TRANSITION
BACKSPACE
CORRECTION
PAUSE
```

Example:

```text
Expected:

technology

Typed:

tecnology
   ↑
 missing H
```

The engine can record:

```text
Error:
    WRONG_KEY

Expected:
    H

Previous:
    C

Transition:
    C → H

Correction:
    YES
```

That signal can then influence future exercises.

---

# ⌨️ Intelligent Virtual Keyboard

The virtual keyboard is not merely visual decoration.

It acts as a real-time visualization layer for the typing model.

### Features

* Live next-key highlighting
* Finger mapping
* Error visualization
* Weak-key indicators
* Transition visualization
* Finger workload
* Keyboard heatmaps
* Physical `KeyboardEvent.code` mapping
* US QWERTY support

Future layout support can include:

```text
QWERTY
AZERTY
QWERTZ
Dvorak
Colemak
```

---

# 🌡️ Keyboard Heatmap

Historical typing data can be visualized directly on the keyboard.

```text
┌─────────────────────────────────────────┐
│ Q  W  E  R  T  Y  U  I  O  P           │
│       ░  ▓  ░        ▒  ▓               │
│ A  S  D  F  G  H  J  K  L               │
│    ░     ▓  ▒     ▓                     │
│ Z  X  C  V  B  N  M                     │
│ ▒     ░     ▓     ▒                     │
└─────────────────────────────────────────┘
```

The keyboard becomes a visual representation of the user's actual typing behavior.

---

# 📚 Structured Learning

TypeFlow includes a progressive English touch-typing curriculum.

```text
FOUNDATION
    ↓
HOME ROW
    ↓
TOP ROW
    ↓
BOTTOM ROW
    ↓
SHIFT
    ↓
PUNCTUATION
    ↓
NUMBERS
    ↓
WORDS
    ↓
SENTENCES
    ↓
PROFESSIONAL TEXT
    ↓
ADVANCED SPEED
```

Every lesson can include:

* target keys
* finger guidance
* focused drills
* real words
* sentences
* accuracy requirements
* progression tracking

### Placement Test

Already know touch typing?

The placement system evaluates performance and determines an appropriate starting point instead of forcing users through beginner material.

---

# 🤖 AI Practice Generation

AI is used for **content generation**, not as the source of truth for performance analytics.

The deterministic engine measures the user's behavior.

AI generates content around the resulting training requirements.

### Topics

* Science
* Space
* Animals
* Technology
* Programming
* Sports
* History
* Gaming
* Business
* Custom topics

### Example

If the engine determines that:

```text
H → E
R → T
P
```

are problematic, an AI lesson can generate natural text containing useful combinations of those targets.

The result:

> **Contextual practice instead of meaningless repetition.**

OpenRouter is accessed server-side so the API key is never exposed to the browser.

---

# 🎮 Progression & Gamification

Gamification exists to reinforce practice — not replace skill development.

## XP

XP can be earned from:

* characters typed
* completed drills
* accuracy
* speed
* consistency
* streaks
* lessons
* mastery milestones

Quality bonuses discourage careless typing for XP farming.

---

## 🪙 Coins

Coins can unlock:

* visual themes
* keyboard styles
* sound packs
* celebration effects
* interface customization

---

## 🔥 Daily Streaks

Practice consistently to maintain a streak.

But TypeFlow treats:

> **Skill improvement > streak length**

---

## 🏆 Achievement System

18+ achievement categories spanning:

* speed
* accuracy
* volume
* consistency
* streaks
* mastery
* lessons
* levels
* coins

Achievement tiers:

```text
🥉 BRONZE
🥈 SILVER
🥇 GOLD
```

---

# 🎯 Daily Quests

Three daily objectives are generated from a deterministic date seed.

Example:

```text
01  Type 2,500 characters

02  Maintain 95% accuracy

03  Complete 3 adaptive drills
```

Possible objective types:

* characters
* minutes
* sessions
* accuracy
* WPM
* lessons
* mastery

---

# 🕹️ Practice Modes

| Mode           | Purpose                                              |
| -------------- | ---------------------------------------------------- |
| **Adaptive**   | Automatically targets your highest-impact weaknesses |
| **Learn**      | Structured touch-typing curriculum                   |
| **Weakness**   | Focuses on weak keys and transitions                 |
| **Speed**      | Maximize sustainable WPM                             |
| **Accuracy**   | Precision-first practice                             |
| **Rhythm**     | Improve typing consistency                           |
| **Free**       | Type anything                                        |
| **Timed Test** | 15s / 30s / 60s / 120s / 300s                        |
| **AI Lessons** | Generate contextual practice                         |
| **Diagnostic** | Analyze typing behavior                              |

---

# 📈 Progress & Statistics

## Dashboard

The dashboard answers one question:

> **What should I work on today?**

Example:

```text
92 WPM
97.4% Accuracy
34 min Practice
+840 XP
🔥 12 Day Streak
```

### Current weaknesses

```text
01  H → E
02  R → T
03  P
04  C → T
05  SHIFT
```

### Current objective

```text
Improve H → E transition fluency
```

---

## Historical Analytics

Track:

* WPM
* accuracy
* practice time
* sessions
* characters
* error rate
* mastery
* transitions
* streaks
* XP

Across:

```text
DAY
WEEK
MONTH
ALL TIME
```

---

# 🔐 Local-First & Cloud Sync

TypeFlow is designed to work without requiring an account.

### Local

Practice data can remain on the device:

```text
Typing Sessions
Skill Profiles
Settings
Game State
Progress
```

### Cloud

When authenticated:

```text
                 ┌─────────────┐
                 │   SUPABASE  │
                 └──────┬──────┘
                        │
              ┌─────────┼─────────┐
              ▼         ▼         ▼
           Profiles   Sessions   Game State
```

Authentication supports:

* Email/password
* Google OAuth

Database security uses PostgreSQL Row-Level Security.

---

# 🛡️ Privacy Architecture

Typing data can reveal behavioral patterns.

TypeFlow therefore follows a local-first architecture:

```text
Keyboard Input
      ↓
Typing Engine
      ↓
Local Analytics
      ↓
Skill Profile
      │
      └───────────────► Cloud Sync
                         when enabled
```

AI credentials remain server-side.

---

# 🎨 Design System

TypeFlow uses a distraction-free interface designed specifically for long typing sessions.

### Built-in themes

* Midnight
* Aurora
* Sunset
* Emerald
* Cyberpunk

### Interface principles

* Keyboard-first interaction
* Minimal distractions
* Strong visual hierarchy
* High readability
* Instant feedback
* Purposeful motion
* Responsive layouts

The interface should feel closer to a **developer tool + training laboratory** than a traditional educational website.

---

# 🏗️ Architecture

```text
src/
│
├── components/
│   ├── dashboard/
│   ├── game/
│   ├── layout/
│   ├── progress/
│   ├── statistics/
│   ├── typing/
│   └── ui/
│
├── core/
│   ├── adaptive/
│   │   ├── mastery.ts
│   │   ├── scheduler.ts
│   │   ├── selector.ts
│   │   ├── transitions.ts
│   │   └── exercises.ts
│   │
│   ├── analytics/
│   │   ├── errors.ts
│   │   ├── rhythm.ts
│   │   ├── consistency.ts
│   │   └── diagnostics.ts
│   │
│   ├── game/
│   │   ├── xp.ts
│   │   ├── levels.ts
│   │   ├── quests.ts
│   │   ├── badges.ts
│   │   └── shop.ts
│   │
│   ├── keyboard/
│   │   ├── layouts.ts
│   │   ├── fingers.ts
│   │   └── mapping.ts
│   │
│   ├── storage/
│   │   ├── local.ts
│   │   └── migrations.ts
│   │
│   └── typing/
│       ├── engine.ts
│       ├── metrics.ts
│       ├── events.ts
│       └── types.ts
│
├── data/
│   ├── curriculum/
│   ├── exercises/
│   └── ai/
│
├── hooks/
│
├── integrations/
│   └── supabase/
│
├── lib/
│   ├── sync/
│   ├── ai/
│   └── utilities/
│
├── routes/
│
└── styles.css
```

---

# 🛠️ Technology Stack

| Layer          | Technology           |
| -------------- | -------------------- |
| Framework      | TanStack Start       |
| UI             | React 19             |
| Language       | TypeScript 5.8       |
| Styling        | Tailwind CSS 4       |
| Components     | Radix UI / shadcn/ui |
| Routing        | TanStack Router      |
| Data Fetching  | TanStack Query       |
| Backend        | Supabase             |
| Database       | PostgreSQL           |
| Authentication | Supabase Auth        |
| AI             | OpenRouter           |
| Build          | Vite + Nitro         |
| Charts         | Recharts             |
| Testing        | Vitest               |

---

# ⌨️ Framework-Free Typing Engine

The core typing engine is intentionally independent from React.

```text
TypingEngine
│
├── Input
│   ├── keydown
│   ├── keyup
│   └── focus / blur
│
├── State
│   ├── pending
│   ├── correct
│   ├── incorrect
│   └── corrected
│
├── Analysis
│   ├── timing
│   ├── transitions
│   ├── errors
│   └── corrections
│
└── Output
    ├── events
    ├── metrics
    └── skill signals
```

The engine has zero React dependencies.

That keeps the intelligence layer:

* testable
* portable
* deterministic
* reusable

---

# 🧪 Testing

Automated tests cover the critical intelligence layers.

### Typing Engine

* keystroke processing
* correction handling
* error classification
* timing calculations

### Adaptive Engine

* mastery scoring
* confidence calculations
* skill selection
* exercise generation

### Analytics

* WPM
* accuracy
* consistency
* hesitation
* transition timing

Run:

```bash
npm run test
```

---

# 🚀 Getting Started

## Prerequisites

* Node.js 18+
* npm or Bun
* Supabase project
* OpenRouter API key for AI lessons

## Installation

```bash
git clone https://github.com/kingofallsnakes/typeflow.git

cd typeflow

npm install
```

## Environment Variables

Create `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

OPENROUTER_API_KEY=your_openrouter_api_key
```

## Development

```bash
npm run dev
```

The development server runs at:

```text
http://localhost:3000
```

## Production

```bash
npm run build
npm run preview
```

---

# 🗺️ Roadmap

## Phase 01 — Intelligence

* [x] Per-key mastery
* [x] Transition analysis
* [x] Adaptive drills
* [x] Error classification
* [x] Spaced repetition
* [x] Personalized exercises

## Phase 02 — Diagnostics

* [ ] Finger-level analytics
* [ ] Keyboard heatmaps
* [ ] Rhythm analysis
* [ ] Error clustering
* [ ] Skill decay prediction
* [ ] Performance forecasting

## Phase 03 — Personalization

* [ ] Personalized curriculum
* [ ] Dynamic difficulty
* [ ] Adaptive lesson length
* [ ] Context-aware AI generation
* [ ] Automatic training plans

## Phase 04 — Competition

* [ ] Global leaderboards
* [ ] Personal records
* [ ] Challenges
* [ ] Ghost races
* [ ] Competitive seasons
* [ ] Skill ratings

## Phase 05 — Platform

* [ ] Multiple keyboard layouts
* [ ] Multiple languages
* [ ] Developer typing mode
* [ ] Coding-symbol drills
* [ ] Writing-specific training
* [ ] Public typing profiles
* [ ] Developer API

---

# 🧠 The Philosophy

TypeFlow isn't trying to be another website where users repeatedly type paragraphs and chase a bigger WPM number.

The objective is simple:

> **Understand the typist. Identify the bottleneck. Train the bottleneck. Measure the improvement. Repeat.**

A traditional typing test says:

```text
96 WPM
```

TypeFlow should eventually tell you:

```text
96 WPM

Your key accuracy is strong.

Your largest performance bottleneck is
H → E transition speed.

You hesitate before punctuation
2.8× more often than average.

Your speed drops 18% after 90 seconds.

Your recommended intervention:

4-minute H → E transition drill
94% minimum accuracy
medium difficulty
```

**That's not just a typing test.**

**That's typing intelligence.**

---

# 📄 License & Rights

This project and all associated rights belong to **Cobra**.

All rights reserved.

---

<p align="center">
  <strong>⚡ TYPEFLOW</strong><br/>
  <em>Learn your keyboard. Understand your patterns. Master your typing.</em>
</p>

<p align="center">
  <sub>Built by Cobra · Powered by data, adaptation, and deliberate practice.</sub>
</p>
