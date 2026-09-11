import { classify, computeMastery, nextReviewAt, type SkillStatus } from "./mastery";
import type { KeyStat, SessionResult, TransitionStat } from "../typing/typingTypes";

export interface KeySkill {
  keyCode: string;
  char: string;
  attempts: number;
  correct: number;
  incorrect: number;
  totalIntervalMs: number;
  lastPracticedAt: number | null;
  mastery: number;
  nextReview: number | null;
  status: SkillStatus;
}

export interface TransitionSkill {
  from: string;
  to: string;
  attempts: number;
  correct: number;
  totalIntervalMs: number;
  lastPracticedAt: number | null;
  mastery: number;
  nextReview: number | null;
  status: SkillStatus;
}

export interface SkillProfile {
  keys: Record<string, KeySkill>;
  transitions: Record<string, TransitionSkill>;
}

export const emptyProfile = (): SkillProfile => ({ keys: {}, transitions: {} });

export const transitionKey = (from: string, to: string) => `${from}>${to}`;

function accuracy(correct: number, attempts: number) {
  return attempts === 0 ? 0 : (correct / attempts) * 100;
}

export function applyKeyStats(
  profile: SkillProfile,
  keyStats: KeyStat[],
  transitionStats: TransitionStat[],
  at: number,
): SkillProfile {
  const keys = { ...profile.keys };
  const transitions = { ...profile.transitions };

  for (const stat of keyStats) {
    const previous = keys[stat.keyCode];
    const merged: KeySkill = {
      keyCode: stat.keyCode,
      char: stat.char,
      attempts: (previous?.attempts ?? 0) + stat.attempts,
      correct: (previous?.correct ?? 0) + stat.correct,
      incorrect: (previous?.incorrect ?? 0) + stat.incorrect,
      totalIntervalMs: (previous?.totalIntervalMs ?? 0) + stat.totalIntervalMs,
      lastPracticedAt: at,
      mastery: 0,
      nextReview: null,
      status: "NEEDS_PRACTICE",
    };
    merged.mastery = computeMastery({
      accuracy: accuracy(merged.correct, merged.attempts),
      averageIntervalMs: merged.attempts ? merged.totalIntervalMs / merged.attempts : 0,
      attempts: merged.attempts,
      lastPracticedAt: merged.lastPracticedAt,
      now: at,
      consistency: accuracy(merged.correct, merged.attempts),
    });
    merged.status = classify(merged.mastery, merged.attempts);
    merged.nextReview = nextReviewAt(merged.mastery, at);
    keys[stat.keyCode] = merged;
  }

  for (const stat of transitionStats) {
    const id = transitionKey(stat.from, stat.to);
    const previous = transitions[id];
    const merged: TransitionSkill = {
      from: stat.from,
      to: stat.to,
      attempts: (previous?.attempts ?? 0) + stat.attempts,
      correct: (previous?.correct ?? 0) + stat.correct,
      totalIntervalMs: (previous?.totalIntervalMs ?? 0) + stat.totalIntervalMs,
      lastPracticedAt: at,
      mastery: 0,
      nextReview: null,
      status: "NEEDS_PRACTICE",
    };
    merged.mastery = computeMastery({
      accuracy: accuracy(merged.correct, merged.attempts),
      averageIntervalMs: merged.attempts ? merged.totalIntervalMs / merged.attempts : 0,
      attempts: merged.attempts,
      lastPracticedAt: at,
      now: at,
      consistency: accuracy(merged.correct, merged.attempts),
    });
    merged.status = classify(merged.mastery, merged.attempts);
    merged.nextReview = nextReviewAt(merged.mastery, at);
    transitions[id] = merged;
  }

  return { keys, transitions };
}

export function applySession(profile: SkillProfile, result: SessionResult): SkillProfile {
  return applyKeyStats(profile, result.keyStats, result.transitionStats, result.finishedAt);
}

export const keyAccuracy = (skill: KeySkill) => accuracy(skill.correct, skill.attempts);
export const transitionAccuracy = (skill: TransitionSkill) =>
  accuracy(skill.correct, skill.attempts);
export const averageInterval = (totalIntervalMs: number, attempts: number) =>
  attempts === 0 ? 0 : totalIntervalMs / attempts;
