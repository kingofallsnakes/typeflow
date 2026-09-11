import { clamp } from "../typing/metrics";
import {
  averageInterval,
  keyAccuracy,
  transitionAccuracy,
  type KeySkill,
  type SkillProfile,
  type TransitionSkill,
} from "./skillProfile";

export interface WeakKey {
  kind: "key";
  char: string;
  keyCode: string;
  accuracy: number;
  averageIntervalMs: number;
  mastery: number;
  attempts: number;
  priority: number;
}

export interface WeakTransition {
  kind: "transition";
  from: string;
  to: string;
  accuracy: number;
  averageIntervalMs: number;
  mastery: number;
  attempts: number;
  priority: number;
}

export type WeakSkill = WeakKey | WeakTransition;

function reviewDue(nextReview: number | null, now: number): number {
  if (!nextReview) return 0;
  const overdueDays = (now - nextReview) / 86_400_000;
  return clamp(overdueDays * 20, 0, 40);
}

function keyPriority(skill: KeySkill, now: number): number {
  const weakness = 100 - skill.mastery;
  const errorFrequency = clamp(100 - keyAccuracy(skill), 0, 100);
  const slowness = clamp((averageInterval(skill.totalIntervalMs, skill.attempts) - 200) / 6, 0, 60);
  const sample = clamp(skill.attempts / 10, 0, 1);
  return (
    (weakness * 0.4 + errorFrequency * 0.35 + slowness * 0.25 + reviewDue(skill.nextReview, now)) *
    (0.4 + 0.6 * sample)
  );
}

function transitionPriority(skill: TransitionSkill, now: number): number {
  const weakness = 100 - skill.mastery;
  const errorFrequency = clamp(100 - transitionAccuracy(skill), 0, 100);
  const slowness = clamp((averageInterval(skill.totalIntervalMs, skill.attempts) - 200) / 5, 0, 70);
  const sample = clamp(skill.attempts / 8, 0, 1);
  return (
    (weakness * 0.35 + errorFrequency * 0.35 + slowness * 0.3 + reviewDue(skill.nextReview, now)) *
    (0.4 + 0.6 * sample)
  );
}

export function weakestKeys(profile: SkillProfile, limit = 6, now = Date.now()): WeakKey[] {
  return Object.values(profile.keys)
    .filter((skill) => skill.attempts >= 5 && skill.char.trim().length > 0)
    .map<WeakKey>((skill) => ({
      kind: "key",
      char: skill.char,
      keyCode: skill.keyCode,
      accuracy: keyAccuracy(skill),
      averageIntervalMs: averageInterval(skill.totalIntervalMs, skill.attempts),
      mastery: skill.mastery,
      attempts: skill.attempts,
      priority: keyPriority(skill, now),
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

export function weakestTransitions(
  profile: SkillProfile,
  limit = 6,
  now = Date.now(),
): WeakTransition[] {
  return Object.values(profile.transitions)
    .filter((skill) => skill.attempts >= 4)
    .map<WeakTransition>((skill) => ({
      kind: "transition",
      from: skill.from,
      to: skill.to,
      accuracy: transitionAccuracy(skill),
      averageIntervalMs: averageInterval(skill.totalIntervalMs, skill.attempts),
      mastery: skill.mastery,
      attempts: skill.attempts,
      priority: transitionPriority(skill, now),
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
}

/** The single skill the learner should work on right now, if any. */
export function topWeakness(profile: SkillProfile, now = Date.now()): WeakSkill | null {
  const key = weakestKeys(profile, 1, now)[0];
  const transition = weakestTransitions(profile, 1, now)[0];
  if (!key && !transition) return null;
  if (!key) return transition ?? null;
  if (!transition) return key;
  return transition.priority >= key.priority ? transition : key;
}

export function describeSkill(skill: WeakSkill): string {
  return skill.kind === "key" ? `"${skill.char}"` : `${skill.from} → ${skill.to}`;
}
