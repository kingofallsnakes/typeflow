import type { SessionResult } from "../typing/typingTypes";
import { dayKey } from "./gamification";

export type QuestKind = "chars" | "minutes" | "sessions" | "accuracy" | "wpm" | "lesson";

export interface Quest {
  id: string;
  kind: QuestKind;
  title: string;
  emoji: string;
  goal: number;
  progress: number;
  xp: number;
  coins: number;
  claimed: boolean;
}

export interface QuestState {
  day: string;
  quests: Quest[];
}

export const EMPTY_QUESTS: QuestState = { day: "", quests: [] };

interface QuestTemplate {
  id: string;
  kind: QuestKind;
  title: string;
  emoji: string;
  goal: number;
  xp: number;
  coins: number;
}

const POOL: QuestTemplate[] = [
  { id: "chars-300", kind: "chars", title: "Type 300 characters", emoji: "⌨️", goal: 300, xp: 40, coins: 10 },
  { id: "chars-700", kind: "chars", title: "Type 700 characters", emoji: "📜", goal: 700, xp: 70, coins: 18 },
  { id: "minutes-5", kind: "minutes", title: "Practise for 5 minutes", emoji: "⏱️", goal: 5, xp: 45, coins: 12 },
  { id: "minutes-10", kind: "minutes", title: "Practise for 10 minutes", emoji: "🕙", goal: 10, xp: 80, coins: 20 },
  { id: "sessions-3", kind: "sessions", title: "Finish 3 runs", emoji: "🎯", goal: 3, xp: 50, coins: 12 },
  { id: "sessions-5", kind: "sessions", title: "Finish 5 runs", emoji: "🏹", goal: 5, xp: 75, coins: 18 },
  { id: "accuracy-95", kind: "accuracy", title: "Finish a run at 95% accuracy", emoji: "💎", goal: 1, xp: 55, coins: 15 },
  { id: "accuracy-98", kind: "accuracy", title: "Finish a run at 98% accuracy", emoji: "✨", goal: 1, xp: 80, coins: 22 },
  { id: "wpm-30", kind: "wpm", title: "Hit 30 WPM in a run", emoji: "🔥", goal: 1, xp: 50, coins: 14 },
  { id: "wpm-45", kind: "wpm", title: "Hit 45 WPM in a run", emoji: "🚀", goal: 1, xp: 85, coins: 24 },
  { id: "lesson-1", kind: "lesson", title: "Complete a course lesson", emoji: "📘", goal: 1, xp: 60, coins: 16 },
];

const THRESHOLDS: Record<string, number> = {
  "accuracy-95": 95,
  "accuracy-98": 98,
  "wpm-30": 30,
  "wpm-45": 45,
};

function hash(text: string): number {
  let value = 0;
  for (let index = 0; index < text.length; index += 1) {
    value = (value * 31 + text.charCodeAt(index)) >>> 0;
  }
  return value;
}

/** Three quests, stable for the whole day, different every day. */
export function questsForDay(day: string): Quest[] {
  const seed = hash(day);
  const pool = [...POOL];
  const picked: QuestTemplate[] = [];
  for (let index = 0; index < 3 && pool.length; index += 1) {
    const [template] = pool.splice((seed >> (index * 3)) % pool.length, 1);
    if (template) picked.push(template);
  }
  return picked.map((template) => ({
    id: template.id,
    kind: template.kind,
    title: template.title,
    emoji: template.emoji,
    goal: template.goal,
    progress: 0,
    xp: template.xp,
    coins: template.coins,
    claimed: false,
  }));
}

export function ensureToday(state: QuestState, day: string = dayKey()): QuestState {
  if (state.day === day && state.quests.length) return state;
  return { day, quests: questsForDay(day) };
}

function increment(quest: Quest, result: SessionResult, lessonCompleted: boolean): number {
  const metrics = result.metrics;
  switch (quest.kind) {
    case "chars":
      return metrics.correctCharacters;
    case "minutes":
      return metrics.durationMs / 60000;
    case "sessions":
      return 1;
    case "accuracy":
      return metrics.accuracy >= (THRESHOLDS[quest.id] ?? 95) ? 1 : 0;
    case "wpm":
      return metrics.wpm >= (THRESHOLDS[quest.id] ?? 30) ? 1 : 0;
    case "lesson":
      return lessonCompleted ? 1 : 0;
    default:
      return 0;
  }
}

export function applySessionToQuests(
  state: QuestState,
  result: SessionResult,
  lessonCompleted = false,
): QuestState {
  const today = ensureToday(state, dayKey(result.finishedAt));
  return {
    ...today,
    quests: today.quests.map((quest) => ({
      ...quest,
      progress: Math.min(quest.goal, quest.progress + increment(quest, result, lessonCompleted)),
    })),
  };
}

export const questComplete = (quest: Quest): boolean => quest.progress >= quest.goal;
export const questPercent = (quest: Quest): number =>
  Math.min(100, (quest.progress / quest.goal) * 100);
