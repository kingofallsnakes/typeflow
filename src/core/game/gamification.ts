import type { SessionResult } from "../typing/typingTypes";

export interface GameState {
  xp: number;
  coins: number;
  /** ISO date strings (yyyy-mm-dd) on which the user practised */
  days: string[];
  /** badge codes already celebrated, so we only celebrate once */
  seenBadges: string[];
  bestStreak: number;
}

export const EMPTY_GAME: GameState = {
  xp: 0,
  coins: 0,
  days: [],
  seenBadges: [],
  bestStreak: 0,
};

export const dayKey = (timestamp: number = Date.now()): string =>
  new Date(timestamp).toISOString().slice(0, 10);

/** Total XP needed to *reach* a level. Level 1 starts at 0. */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  return Math.round(60 * (level - 1) ** 1.6);
}

export function levelForXp(xp: number): number {
  let level = 1;
  while (xpForLevel(level + 1) <= xp && level < 200) level += 1;
  return level;
}

export interface LevelInfo {
  level: number;
  current: number;
  needed: number;
  percent: number;
  title: string;
}

const LEVEL_TITLES = [
  "Rookie",
  "Sprout",
  "Tapper",
  "Drummer",
  "Rhythm Rider",
  "Key Runner",
  "Word Smith",
  "Speed Cadet",
  "Flow Seeker",
  "Keyboard Ninja",
  "Type Master",
  "Legend",
];

export function levelTitle(level: number): string {
  const index = Math.min(LEVEL_TITLES.length - 1, Math.floor((level - 1) / 3));
  return LEVEL_TITLES[index] as string;
}

export function levelInfo(xp: number): LevelInfo {
  const level = levelForXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const current = xp - base;
  const needed = Math.max(1, next - base);
  return {
    level,
    current,
    needed,
    percent: Math.min(100, (current / needed) * 100),
    title: levelTitle(level),
  };
}

export interface SessionReward {
  xp: number;
  coins: number;
  bonuses: { label: string; xp: number }[];
}

/** XP is earned from real typing: volume, then quality multipliers. */
export function rewardForSession(result: SessionResult, streak: number): SessionReward {
  const m = result.metrics;
  const words = Math.max(0, m.correctCharacters / 5);
  const base = Math.round(words * 2);
  const bonuses: { label: string; xp: number }[] = [];

  if (m.accuracy >= 99) bonuses.push({ label: "Flawless accuracy", xp: Math.round(base * 0.5) });
  else if (m.accuracy >= 95) bonuses.push({ label: "Sharp accuracy", xp: Math.round(base * 0.25) });

  if (m.wpm >= 60) bonuses.push({ label: "Speed demon", xp: Math.round(base * 0.35) });
  else if (m.wpm >= 40) bonuses.push({ label: "Quick fingers", xp: Math.round(base * 0.15) });

  if (m.consistency >= 80) bonuses.push({ label: "Steady rhythm", xp: Math.round(base * 0.2) });
  if (streak >= 3) bonuses.push({ label: `${streak}-day streak`, xp: Math.min(60, streak * 5) });

  const xp = Math.max(5, base + bonuses.reduce((total, bonus) => total + bonus.xp, 0));
  return { xp, coins: Math.max(1, Math.round(xp / 8)), bonuses };
}

export function streakFromDays(days: string[]): number {
  const set = new Set(days);
  const cursor = new Date();
  let streak = 0;
  // today may not be practised yet — start from yesterday in that case
  if (!set.has(dayKey(cursor.getTime()))) cursor.setDate(cursor.getDate() - 1);
  while (set.has(dayKey(cursor.getTime()))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export interface BadgeContext {
  sessions: number;
  characters: number;
  bestWpm: number;
  bestAccuracy: number;
  lessonsCompleted: number;
  streak: number;
  level: number;
  coins: number;
}

export interface Badge {
  code: string;
  title: string;
  description: string;
  emoji: string;
  tier: "bronze" | "silver" | "gold";
  reached: (context: BadgeContext) => number;
  goal: number;
  unit?: string;
}

export const BADGES: Badge[] = [
  {
    code: "first-session",
    title: "First steps",
    description: "Finish your very first typing session.",
    emoji: "🌱",
    tier: "bronze",
    reached: (c) => c.sessions,
    goal: 1,
  },
  {
    code: "sessions-25",
    title: "Regular",
    description: "Finish 25 sessions.",
    emoji: "🎯",
    tier: "silver",
    reached: (c) => c.sessions,
    goal: 25,
  },
  {
    code: "chars-1000",
    title: "Thousand club",
    description: "Type 1,000 characters in total.",
    emoji: "✍️",
    tier: "bronze",
    reached: (c) => c.characters,
    goal: 1000,
  },
  {
    code: "chars-10000",
    title: "Marathon hands",
    description: "Type 10,000 characters in total.",
    emoji: "🏃",
    tier: "silver",
    reached: (c) => c.characters,
    goal: 10000,
  },
  {
    code: "chars-50000",
    title: "Keyboard legend",
    description: "Type 50,000 characters in total.",
    emoji: "👑",
    tier: "gold",
    reached: (c) => c.characters,
    goal: 50000,
  },
  {
    code: "wpm-30",
    title: "Warming up",
    description: "Finish a session at 30 WPM.",
    emoji: "🔥",
    tier: "bronze",
    reached: (c) => c.bestWpm,
    goal: 30,
    unit: "wpm",
  },
  {
    code: "wpm-50",
    title: "Fast lane",
    description: "Finish a session at 50 WPM.",
    emoji: "⚡",
    tier: "silver",
    reached: (c) => c.bestWpm,
    goal: 50,
    unit: "wpm",
  },
  {
    code: "wpm-80",
    title: "Lightning",
    description: "Finish a session at 80 WPM.",
    emoji: "🚀",
    tier: "gold",
    reached: (c) => c.bestWpm,
    goal: 80,
    unit: "wpm",
  },
  {
    code: "acc-95",
    title: "Sharp shooter",
    description: "Finish a session at 95% accuracy.",
    emoji: "🎪",
    tier: "bronze",
    reached: (c) => c.bestAccuracy,
    goal: 95,
    unit: "%",
  },
  {
    code: "acc-99",
    title: "Near perfect",
    description: "Finish a session at 99% accuracy.",
    emoji: "💎",
    tier: "gold",
    reached: (c) => c.bestAccuracy,
    goal: 99,
    unit: "%",
  },
  {
    code: "streak-3",
    title: "On a roll",
    description: "Practise three days in a row.",
    emoji: "🔥",
    tier: "bronze",
    reached: (c) => c.streak,
    goal: 3,
    unit: "days",
  },
  {
    code: "streak-7",
    title: "Week warrior",
    description: "Practise seven days in a row.",
    emoji: "🗓️",
    tier: "silver",
    reached: (c) => c.streak,
    goal: 7,
    unit: "days",
  },
  {
    code: "streak-30",
    title: "Unstoppable",
    description: "Practise thirty days in a row.",
    emoji: "🏆",
    tier: "gold",
    reached: (c) => c.streak,
    goal: 30,
    unit: "days",
  },
  {
    code: "lessons-5",
    title: "Student",
    description: "Pass five course lessons.",
    emoji: "📘",
    tier: "bronze",
    reached: (c) => c.lessonsCompleted,
    goal: 5,
  },
  {
    code: "lessons-10",
    title: "Graduate",
    description: "Pass ten course lessons.",
    emoji: "🎓",
    tier: "gold",
    reached: (c) => c.lessonsCompleted,
    goal: 10,
  },
  {
    code: "level-5",
    title: "Level five",
    description: "Reach level 5.",
    emoji: "⭐",
    tier: "silver",
    reached: (c) => c.level,
    goal: 5,
  },
  {
    code: "level-10",
    title: "Double digits",
    description: "Reach level 10.",
    emoji: "🌟",
    tier: "gold",
    reached: (c) => c.level,
    goal: 10,
  },
  {
    code: "coins-500",
    title: "Coin collector",
    description: "Collect 500 coins.",
    emoji: "🪙",
    tier: "silver",
    reached: (c) => c.coins,
    goal: 500,
  },
];

export const earnedBadges = (context: BadgeContext): Badge[] =>
  BADGES.filter((badge) => badge.reached(context) >= badge.goal);
