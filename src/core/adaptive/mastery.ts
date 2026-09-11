import { clamp } from "../typing/metrics";

export type SkillStatus = "NEEDS_PRACTICE" | "LEARNING" | "REVIEW" | "MASTERED";

export const MIN_ATTEMPTS_FOR_MASTERY = 20;

export interface MasteryInput {
  accuracy: number; // 0-100
  averageIntervalMs: number;
  attempts: number;
  lastPracticedAt: number | null;
  now?: number;
  /** 0-100, from recent-vs-historical stability */
  consistency?: number;
}

const TARGET_INTERVAL_MS = 180; // ~66 wpm per character
const SLOW_INTERVAL_MS = 700;

export function normalizedSpeed(averageIntervalMs: number): number {
  if (averageIntervalMs <= 0) return 0;
  if (averageIntervalMs <= TARGET_INTERVAL_MS) return 100;
  if (averageIntervalMs >= SLOW_INTERVAL_MS) return 0;
  return ((SLOW_INTERVAL_MS - averageIntervalMs) / (SLOW_INTERVAL_MS - TARGET_INTERVAL_MS)) * 100;
}

export function recencyScore(lastPracticedAt: number | null, now: number): number {
  if (!lastPracticedAt) return 0;
  const days = (now - lastPracticedAt) / 86_400_000;
  if (days <= 1) return 100;
  if (days >= 14) return 0;
  return clamp(100 - ((days - 1) / 13) * 100, 0, 100);
}

export function computeMastery(input: MasteryInput): number {
  const now = input.now ?? Date.now();
  const accuracyScore = clamp(input.accuracy, 0, 100) * 0.5;
  const speedScore = normalizedSpeed(input.averageIntervalMs) * 0.2;
  const consistencyScore = clamp(input.consistency ?? 50, 0, 100) * 0.15;
  const recency = recencyScore(input.lastPracticedAt, now) * 0.15;

  const raw = accuracyScore + speedScore + consistencyScore + recency;
  // Confidence penalty: a skill cannot be "mastered" from a handful of samples.
  const confidence = clamp(input.attempts / MIN_ATTEMPTS_FOR_MASTERY, 0, 1);
  return clamp(raw * (0.55 + 0.45 * confidence), 0, 100);
}

export function classify(mastery: number, attempts: number): SkillStatus {
  if (attempts < 5) return "NEEDS_PRACTICE";
  if (mastery >= 80 && attempts >= MIN_ATTEMPTS_FOR_MASTERY) return "MASTERED";
  if (mastery >= 60) return "REVIEW";
  if (mastery >= 40) return "LEARNING";
  return "NEEDS_PRACTICE";
}

/** SM-2 inspired interval, in days, based on mastery. */
export function nextReviewAt(mastery: number, lastPracticedAt: number): number {
  const days = mastery >= 80 ? 7 : mastery >= 60 ? 3 : mastery >= 40 ? 1 : 0.25;
  return lastPracticedAt + days * 86_400_000;
}
