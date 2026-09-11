export type ErrorType =
  | "wrong_key"
  | "shift_error"
  | "repeated_error"
  | "hesitation"
  | "slow_transition";

export interface KeystrokeRecord {
  index: number;
  expected: string;
  actual: string;
  correct: boolean;
  /** ms since session start */
  at: number;
  /** ms since previous keystroke */
  interval: number;
  errorTypes: ErrorType[];
}

export interface TypingSnapshot {
  targetText: string;
  cursor: number;
  /** per-character state, length === targetText.length */
  states: CharState[];
  started: boolean;
  completed: boolean;
  elapsedMs: number;
  correct: number;
  incorrect: number;
  backspaces: number;
  keystrokes: number;
}

export type CharState = "pending" | "correct" | "incorrect" | "corrected";

export interface SessionMetrics {
  wpm: number;
  rawWpm: number;
  cpm: number;
  accuracy: number;
  errorRate: number;
  backspaceRate: number;
  consistency: number;
  correctCharacters: number;
  incorrectCharacters: number;
  totalKeystrokes: number;
  backspaces: number;
  durationMs: number;
  averageIntervalMs: number;
}

export interface KeyStat {
  keyCode: string;
  char: string;
  attempts: number;
  correct: number;
  incorrect: number;
  totalIntervalMs: number;
}

export interface TransitionStat {
  from: string;
  to: string;
  attempts: number;
  correct: number;
  totalIntervalMs: number;
}

export interface SessionResult {
  id: string;
  mode: string;
  lessonId?: string;
  finishedAt: number;
  metrics: SessionMetrics;
  keyStats: KeyStat[];
  transitionStats: TransitionStat[];
}
