import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TypingEngine } from "@/core/typing/typingEngine";
import type { SessionMetrics, SessionResult, TypingSnapshot } from "@/core/typing/typingTypes";
import { recordSession } from "@/core/storage/localStore";

export interface UseTypingSessionOptions {
  mode: string;
  lessonId?: string;
  /** optional time limit in ms; session ends when it expires */
  durationMs?: number;
  /** persist result to local profile on completion (default true) */
  persist?: boolean;
  onComplete?: (result: SessionResult) => void;
}

export interface TypingSessionState {
  snapshot: TypingSnapshot;
  metrics: SessionMetrics;
  lastKeyCode: string | null;
  wrongKeyCode: string | null;
  remainingMs: number | null;
  finished: boolean;
  result: SessionResult | null;
  restart: (nextText?: string) => void;
}

const emptySnapshot = (text: string): TypingSnapshot => ({
  targetText: text,
  cursor: 0,
  states: new Array(text.length).fill("pending"),
  started: false,
  completed: false,
  elapsedMs: 0,
  correct: 0,
  incorrect: 0,
  backspaces: 0,
  keystrokes: 0,
});

const emptyMetrics: SessionMetrics = {
  wpm: 0,
  rawWpm: 0,
  cpm: 0,
  accuracy: 100,
  errorRate: 0,
  backspaceRate: 0,
  consistency: 0,
  correctCharacters: 0,
  incorrectCharacters: 0,
  totalKeystrokes: 0,
  backspaces: 0,
  durationMs: 0,
  averageIntervalMs: 0,
};

export function useTypingSession(
  targetText: string,
  options: UseTypingSessionOptions,
): TypingSessionState {
  const { mode, lessonId, durationMs, persist = true, onComplete } = options;
  const engineRef = useRef<TypingEngine>(new TypingEngine(targetText));
  const [text, setText] = useState(targetText);
  const [snapshot, setSnapshot] = useState<TypingSnapshot>(() => emptySnapshot(targetText));
  const [metrics, setMetrics] = useState<SessionMetrics>(emptyMetrics);
  const [lastKeyCode, setLastKeyCode] = useState<string | null>(null);
  const [wrongKeyCode, setWrongKeyCode] = useState<string | null>(null);
  const [remainingMs, setRemainingMs] = useState<number | null>(durationMs ?? null);
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<SessionResult | null>(null);
  const finishedRef = useRef(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  const reset = useCallback(
    (nextText: string) => {
      engineRef.current = new TypingEngine(nextText);
      finishedRef.current = false;
      setText(nextText);
      setSnapshot(emptySnapshot(nextText));
      setMetrics(emptyMetrics);
      setLastKeyCode(null);
      setWrongKeyCode(null);
      setRemainingMs(durationMs ?? null);
      setFinished(false);
      setResult(null);
    },
    [durationMs],
  );

  useEffect(() => {
    if (targetText !== text) reset(targetText);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetText]);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    const engine = engineRef.current;
    if (!engine.isStarted) return;
    finishedRef.current = true;
    engine.finish();
    const finalMetrics = engine.metrics();
    const sessionResult: SessionResult = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      mode,
      ...(lessonId ? { lessonId } : {}),
      finishedAt: Date.now(),
      metrics: finalMetrics,
      keyStats: engine.keyStats(),
      transitionStats: engine.transitionStats(),
    };
    if (persist) recordSession(sessionResult);
    setMetrics(finalMetrics);
    setSnapshot(engine.snapshot());
    setResult(sessionResult);
    setFinished(true);
    completeRef.current?.(sessionResult);
  }, [mode, lessonId, persist]);

  // Physical keyboard input
  useEffect(() => {
    if (finished) return;
    const handler = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const engine = engineRef.current;
      let char: string | null = null;
      if (event.key === "Backspace") char = "Backspace";
      else if (event.key === "Enter") char = "\n";
      else if (event.key === "Tab") char = null;
      else if (event.key.length === 1) char = event.key;
      if (char === null) return;

      event.preventDefault();
      const applied = engine.input({ char, shiftKey: event.shiftKey, at: Date.now() });
      if (!applied) return;

      const nextSnapshot = engine.snapshot();
      setSnapshot(nextSnapshot);
      setMetrics(engine.metrics());
      setLastKeyCode(event.code);
      const lastStroke = engine.records().at(-1);
      setWrongKeyCode(lastStroke && !lastStroke.correct ? event.code : null);

      if (nextSnapshot.completed) finish();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [finished, finish]);

  // Live metrics ticker + timer
  useEffect(() => {
    if (finished) return;
    const interval = window.setInterval(() => {
      const engine = engineRef.current;
      if (!engine.isStarted) return;
      setMetrics(engine.metrics());
      setSnapshot(engine.snapshot());
      if (durationMs) {
        const left = durationMs - engine.elapsedMs();
        setRemainingMs(Math.max(0, left));
        if (left <= 0) finish();
      }
    }, 200);
    return () => window.clearInterval(interval);
  }, [finished, durationMs, finish]);

  // Pause when the tab loses focus
  useEffect(() => {
    const onBlur = () => engineRef.current.pause();
    const onFocus = () => engineRef.current.resume();
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
    };
  }, []);

  const restart = useCallback((nextText?: string) => reset(nextText ?? text), [reset, text]);

  return useMemo(
    () => ({
      snapshot,
      metrics,
      lastKeyCode,
      wrongKeyCode,
      remainingMs,
      finished,
      result,
      restart,
    }),
    [snapshot, metrics, lastKeyCode, wrongKeyCode, remainingMs, finished, result, restart],
  );
}
