import type { KeystrokeRecord, SessionMetrics } from "./typingTypes";

export function wpmFrom(characters: number, durationMs: number): number {
  if (durationMs <= 0 || characters <= 0) return 0;
  const minutes = durationMs / 60000;
  return characters / 5 / minutes;
}

export function accuracyFrom(correct: number, incorrect: number): number {
  const total = correct + incorrect;
  if (total === 0) return 100;
  return (correct / total) * 100;
}

/**
 * Consistency = 100 - coefficient of variation of keystroke intervals (clamped).
 * A steady rhythm scores high; bursty typing scores low.
 */
export function consistencyFrom(intervals: number[]): number {
  const usable = intervals.filter((i) => i > 0 && i < 3000);
  if (usable.length < 4) return 0;
  const mean = usable.reduce((a, b) => a + b, 0) / usable.length;
  if (mean === 0) return 0;
  const variance = usable.reduce((a, b) => a + (b - mean) ** 2, 0) / usable.length;
  const cv = Math.sqrt(variance) / mean;
  return clamp(100 - cv * 100, 0, 100);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function computeMetrics(
  keystrokes: KeystrokeRecord[],
  backspaces: number,
  durationMs: number,
): SessionMetrics {
  const correct = keystrokes.filter((s) => s.correct).length;
  const incorrect = keystrokes.length - correct;
  const intervals = keystrokes.map((s) => s.interval).slice(1);
  const averageIntervalMs = intervals.length
    ? intervals.reduce((a, b) => a + b, 0) / intervals.length
    : 0;

  return {
    wpm: wpmFrom(correct, durationMs),
    rawWpm: wpmFrom(keystrokes.length, durationMs),
    cpm: durationMs > 0 ? correct / (durationMs / 60000) : 0,
    accuracy: accuracyFrom(correct, incorrect),
    errorRate: keystrokes.length ? (incorrect / keystrokes.length) * 100 : 0,
    backspaceRate: keystrokes.length ? (backspaces / keystrokes.length) * 100 : 0,
    consistency: consistencyFrom(intervals),
    correctCharacters: correct,
    incorrectCharacters: incorrect,
    totalKeystrokes: keystrokes.length,
    backspaces,
    durationMs,
    averageIntervalMs,
  };
}
