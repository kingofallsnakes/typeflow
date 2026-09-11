<p align="center">
  <strong>TYPEFLOW</strong><br/>
  <em>Adaptive touch typing coach</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TanStack_Start-SSR-FF4154?logo=react-query&logoColor=white" alt="TanStack Start" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?logo=supabase&logoColor=white" alt="Supabase" />
</p>

---

TypeFlow analyses **every keystroke** you make, identifies exactly which keys and key-transitions you struggle with, and generates **personalised drills** around your weaknesses. No random filler — every exercise exists because the adaptive engine found a gap in your muscle memory.

## ✨ Features

### 🧠 Adaptive Engine
- **Per-key mastery scoring** — accuracy, speed and sample-size confidence per key
- **Per-transition tracking** — measures the interval between every key pair (e.g. `t→h`, `e→r`)
- **Spaced repetition scheduling** — weak skills surface for review before they decay
- **Deterministic skill selection** — the engine always picks the most impactful drill next

### ⌨️ Typing Engine
- Framework-free **TypingEngine** class with zero dependencies
- Real-time character states: `pending → correct / incorrect / corrected`
- Error classification: wrong key, shift error, repeated mistake, hesitation (>900ms), slow transition (>500ms)
- Backspace and correction tracking
- Pause-on-blur with automatic duration adjustment

### 📊 Real-Time Analytics
| Metric | Description |
|--------|-------------|
| **WPM / CPM** | Words and characters per minute (net, adjusted for errors) |
| **Accuracy** | Percentage of correct keystrokes |
| **Consistency** | Standard deviation of per-word speeds |
| **Error rate** | Errors per character |
| **Backspace rate** | Corrections per character |
| **Hesitation** | Keys typed after a >900ms pause |

### 📚 Structured Course
- **English Touch Typing** course: home row → top row → bottom row → punctuation → full sentences
- Each lesson targets specific keys with focused drills and real words
- Minimum accuracy gates to advance (92%+)
- Placement test to skip ahead if you already know the basics

### 🤖 AI-Generated Lessons
- Pick a topic: animals, space, jokes, coding, sports, history, and more
- Choose difficulty (beginner / medium / hard / expert) and length
- Or type any custom topic and get fresh practice text instantly
- Powered by OpenRouter API (server-side, key never exposed to client)

### 🎮 Gamification
- **XP & Levels** — earn XP from real typing volume with quality bonuses (accuracy, speed, consistency, streak)
- **12 level titles** — Rookie → Sprout → Tapper → ... → Keyboard Ninja → Type Master → Legend
- **Coins** — earned alongside XP, spent in the shop
- **Daily Streaks** — practise every day to build and maintain your streak
- **18 Badges** — bronze, silver and gold tiers across sessions, characters, speed, accuracy, streaks, levels and coins
- **3 Daily Quests** — unique each day, seeded by date, covering characters, minutes, sessions, accuracy, speed and lessons
- **Coin Shop** — unlock themes (Aurora, Sunset, Emerald, Midnight, Cyberpunk), keyboard styles, sound packs and celebration effects

### 🎯 Practice Modes
| Mode | What it does |
|------|-------------|
| **Learn** | Structured course lessons with progressive unlocking |
| **Weakness** | Drills generated from your actual weak keys and transitions |
| **Speed** | Focus on typing faster with WPM-optimised exercises |
| **Accuracy** | Precision drills that penalise mistakes |
| **Free** | Open practice with any text you like |
| **Timed Test** | 15s, 30s, 60s, 120s or 300s speed tests |
| **AI Lessons** | Fresh practice text on any topic, any difficulty |

### 🖥️ Virtual Keyboard
- Colour-coded **finger mapping** for every key
- Live **next-key highlighting** showing which key to reach for
- US QWERTY layout with physical `KeyboardEvent.code` mapping

### 📈 Progress & Statistics
- **Progress page** — speed, accuracy and practice time charted over days, weeks and months
- **Statistics page** — detailed tables of all sessions, per-key stats and per-transition stats
- **Dashboard** — today's practice, daily goal progress, XP bar, weakest keys, weakest transitions, current problem skill

### 🔐 Auth & Cloud Sync
- **Email/password** sign-up and sign-in
- **Google OAuth** integration
- Cloud sync of profiles, sessions and game state via Supabase
- Data stays local on your device until you choose to sign in
- Row-level security on all database tables

### 🎨 Theming
- **Dark mode** by default with a **light mode** toggle
- System preference detection
- Custom design system with CSS variables
- Shop-unlockable colour themes

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (SSR + server functions) |
| **UI** | React 19 + TypeScript 5.8 |
| **Styling** | Tailwind CSS 4 + custom design system |
| **Components** | Radix UI primitives (shadcn/ui) |
| **Routing** | TanStack Router (file-based) |
| **Data fetching** | TanStack React Query |
| **Auth & Database** | Supabase (Auth, PostgreSQL, RLS) |
| **AI** | OpenRouter API (server-side) |
| **Build** | Vite 8 + Nitro |
| **Testing** | Vitest (18 unit tests for engine + adaptive algorithms) |
| **Charts** | Recharts |

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── game/            #   Celebrations, daily quests
│   ├── layout/          #   App shell, navigation
│   ├── typing/          #   Typing workspace, virtual keyboard, metrics
│   └── ui/              #   Radix/shadcn primitives
├── context/             # React context providers (Auth, Game, Settings)
├── core/                # Framework-free core logic
│   ├── adaptive/        #   Skill profiles, mastery scoring, exercise generation
│   ├── game/            #   Gamification, quests, shop, placement
│   ├── keyboard/        #   Layouts, finger mapping, key types
│   ├── storage/         #   localStorage persistence
│   └── typing/          #   TypingEngine, metrics, types
├── data/                # Curriculum, AI categories
├── hooks/               # Custom React hooks
├── integrations/        # Supabase client, auth middleware
├── lib/                 # Utilities, cloud sync, AI lesson server function
├── routes/              # TanStack Router file-based routes
└── styles.css           # Design system (CSS variables, themes)
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **npm** or **bun**

### Installation

```bash
git clone https://github.com/kingofallsnakes/typeflow.git
cd typeflow
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# AI Lessons (optional — needed for AI-generated lessons)
OPENROUTER_API_KEY=your_openrouter_api_key
```

### Development

```bash
npm run dev
```

The app runs at `http://localhost:3000` with hot module replacement.

### Build

```bash
npm run build
npm run preview
```

### Testing

```bash
npm run test
```

Runs 18 unit tests covering the typing engine, metrics calculation, adaptive mastery scoring, skill selection and exercise generation.

## 📄 License & Rights

This project and all rights belong to **Cobra** ([kingofallsnakes](https://github.com/kingofallsnakes)). All rights reserved.

---

<p align="center">
  <sub>⚡ TypeFlow · Watermark: <strong>cobra</strong></sub>
</p>
