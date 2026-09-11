import { targetForChar } from "../keyboard/keyboardLayouts";
import { computeMetrics } from "./metrics";
import type {
  CharState,
  ErrorType,
  KeyStat,
  KeystrokeRecord,
  SessionMetrics,
  TransitionStat,
  TypingSnapshot,
} from "./typingTypes";

export interface EngineInput {
  /** printable character produced, or "Backspace" */
  char: string;
  shiftKey?: boolean;
  /** timestamp in ms (performance.now or Date.now) */
  at: number;
}

const HESITATION_MS = 900;
const SLOW_TRANSITION_MS = 500;

/**
 * Framework-agnostic typing engine. Feed it a target text and keystrokes;
 * it returns state, metrics and per-key/per-transition statistics.
 */
export class TypingEngine {
  private target: string;
  private states: CharState[];
  private cursor = 0;
  private startedAt: number | null = null;
  private lastAt: number | null = null;
  private pausedTotal = 0;
  private pausedAt: number | null = null;
  private endedAt: number | null = null;
  private keystrokes: KeystrokeRecord[] = [];
  private backspaces = 0;
  private lastErrorAtIndex = new Map<number, number>();

  constructor(targetText: string) {
    this.target = targetText;
    this.states = new Array(targetText.length).fill("pending") as CharState[];
  }

  get targetText(): string {
    return this.target;
  }

  get isCompleted(): boolean {
    return this.target.length > 0 && this.cursor >= this.target.length;
  }

  get isStarted(): boolean {
    return this.startedAt !== null;
  }

  elapsedMs(now?: number): number {
    if (this.startedAt === null) return 0;
    const end = this.endedAt ?? this.pausedAt ?? now ?? Date.now();
    return Math.max(0, end - this.startedAt - this.pausedTotal);
  }

  pause(at: number = Date.now()): void {
    if (this.startedAt === null || this.pausedAt !== null || this.endedAt !== null) return;
    this.pausedAt = at;
  }

  resume(at: number = Date.now()): void {
    if (this.pausedAt === null) return;
    this.pausedTotal += at - this.pausedAt;
    this.pausedAt = null;
    this.lastAt = at;
  }

  finish(at: number = Date.now()): void {
    if (this.endedAt === null && this.startedAt !== null) this.endedAt = at;
  }

  /** Apply one input. Returns true when the input was consumed. */
  input(event: EngineInput): boolean {
    if (this.endedAt !== null || this.target.length === 0) return false;
    if (this.pausedAt !== null) this.resume(event.at);

    if (event.char === "Backspace") {
      if (this.cursor === 0) return false;
      this.backspaces += 1;
      this.cursor -= 1;
      const previous = this.states[this.cursor];
      this.states[this.cursor] = previous === "incorrect" ? "corrected" : "pending";
      this.lastAt = event.at;
      return true;
    }

    if (event.char.length !== 1) return false;

    if (this.startedAt === null) {
      this.startedAt = event.at;
      this.lastAt = event.at;
    }

    const expected = this.target[this.cursor] ?? "";
    const correct = event.char === expected;
    const interval = this.lastAt === null ? 0 : event.at - this.lastAt;

    const errorTypes: ErrorType[] = [];
    if (!correct) {
      errorTypes.push("wrong_key");
      const expectedTarget = targetForChar(expected);
      const actualTarget = targetForChar(event.char);
      if (
        expectedTarget &&
        actualTarget &&
        expectedTarget.keyCode === actualTarget.keyCode &&
        expectedTarget.shiftRequired !== actualTarget.shiftRequired
      ) {
        errorTypes.push("shift_error");
      }
      const errorsHere = this.lastErrorAtIndex.get(this.cursor) ?? 0;
      if (errorsHere > 0) errorTypes.push("repeated_error");
      this.lastErrorAtIndex.set(this.cursor, errorsHere + 1);
    }
    if (interval >= HESITATION_MS) errorTypes.push("hesitation");
    else if (!correct && interval >= SLOW_TRANSITION_MS) errorTypes.push("slow_transition");

    this.keystrokes.push({
      index: this.cursor,
      expected,
      actual: event.char,
      correct,
      at: event.at - this.startedAt,
      interval,
      errorTypes,
    });

    const prior = this.states[this.cursor];
    this.states[this.cursor] = correct
      ? prior === "corrected" || prior === "incorrect"
        ? "corrected"
        : "correct"
      : "incorrect";

    this.cursor += 1;
    this.lastAt = event.at;

    if (this.isCompleted) this.finish(event.at);
    return true;
  }

  snapshot(now?: number): TypingSnapshot {
    const correct = this.keystrokes.filter((s) => s.correct).length;
    return {
      targetText: this.target,
      cursor: this.cursor,
      states: [...this.states],
      started: this.isStarted,
      completed: this.isCompleted,
      elapsedMs: this.elapsedMs(now),
      correct,
      incorrect: this.keystrokes.length - correct,
      backspaces: this.backspaces,
      keystrokes: this.keystrokes.length,
    };
  }

  metrics(now?: number): SessionMetrics {
    return computeMetrics(this.keystrokes, this.backspaces, this.elapsedMs(now));
  }

  records(): KeystrokeRecord[] {
    return [...this.keystrokes];
  }

  keyStats(): KeyStat[] {
    const map = new Map<string, KeyStat>();
    for (const stroke of this.keystrokes) {
      const expected = stroke.expected;
      if (!expected) continue;
      const target = targetForChar(expected);
      const keyCode = target?.keyCode ?? expected;
      const existing = map.get(keyCode) ?? {
        keyCode,
        char: expected,
        attempts: 0,
        correct: 0,
        incorrect: 0,
        totalIntervalMs: 0,
      };
      existing.attempts += 1;
      if (stroke.correct) existing.correct += 1;
      else existing.incorrect += 1;
      existing.totalIntervalMs += Math.min(stroke.interval, 3000);
      map.set(keyCode, existing);
    }
    return [...map.values()];
  }

  transitionStats(): TransitionStat[] {
    const map = new Map<string, TransitionStat>();
    for (let i = 1; i < this.keystrokes.length; i += 1) {
      const previous = this.keystrokes[i - 1]!;
      const current = this.keystrokes[i]!;
      if (!previous.expected.trim() || !current.expected.trim()) continue;
      if (current.index !== previous.index + 1) continue;
      const key = `${previous.expected}>${current.expected}`;
      const existing = map.get(key) ?? {
        from: previous.expected,
        to: current.expected,
        attempts: 0,
        correct: 0,
        totalIntervalMs: 0,
      };
      existing.attempts += 1;
      if (current.correct && previous.correct) existing.correct += 1;
      existing.totalIntervalMs += Math.min(current.interval, 3000);
      map.set(key, existing);
    }
    return [...map.values()];
  }
}
