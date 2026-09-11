import { useEffect, useRef } from "react";
import { useTypingSession } from "@/hooks/useTypingSession";
import { useSettings } from "@/context/SettingsContext";
import { useGame } from "@/context/GameContext";
import { sfx } from "@/lib/sfx";
import { TypingText } from "./TypingText";
import { FingerHint, VirtualKeyboard } from "./VirtualKeyboard";
import { MetricsBar } from "./MetricsBar";
import { ResultSummary } from "./ResultSummary";
import type { SessionResult } from "@/core/typing/typingTypes";

interface Props {
  text: string;
  mode: string;
  lessonId?: string;
  durationMs?: number;
  title: string;
  subtitle?: string;
  goal?: string;
  onComplete?: (result: SessionResult) => void;
  onRestartRequest?: () => void;
}

export function TypingWorkspace({
  text,
  mode,
  lessonId,
  durationMs,
  title,
  subtitle,
  goal,
  onComplete,
  onRestartRequest,
}: Props) {
  const { settings } = useSettings();
  const { awardSession } = useGame();
  const session = useTypingSession(text, {
    mode,
    ...(lessonId ? { lessonId } : {}),
    ...(durationMs ? { durationMs } : {}),
    ...(onComplete ? { onComplete } : {}),
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const awardedRef = useRef<string | null>(null);
  const strokeRef = useRef({ correct: 0, incorrect: 0 });

  useEffect(() => {
    containerRef.current?.focus();
  }, [text]);

  // Keystroke feedback sounds
  useEffect(() => {
    if (!settings.soundEnabled) return;
    const previous = strokeRef.current;
    const { correct, incorrect } = session.snapshot;
    if (incorrect > previous.incorrect) sfx.error();
    else if (correct > previous.correct) sfx.key();
    strokeRef.current = { correct, incorrect };
  }, [session.snapshot, settings.soundEnabled]);

  // XP, coins, streak and badges for every finished session
  useEffect(() => {
    const result = session.result;
    if (!result || awardedRef.current === result.id) return;
    awardedRef.current = result.id;
    awardSession(result);
  }, [session.result, awardSession]);

  const nextChar = session.snapshot.targetText[session.snapshot.cursor];
  const progress =
    session.snapshot.targetText.length === 0
      ? 0
      : (session.snapshot.cursor / session.snapshot.targetText.length) * 100;

  if (session.finished && session.result) {
    return (
      <ResultSummary
        result={session.result}
        onRestart={() => (onRestartRequest ? onRestartRequest() : session.restart())}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      tabIndex={-1}
      className="space-y-6 outline-none sm:space-y-8"
      aria-label={`${title} typing exercise`}
    >
      <header className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-4">
        <div>
          <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">{mode}</p>
          <h1 className="text-balance-tight mt-1 text-2xl font-semibold sm:text-3xl">{title}</h1>
          {subtitle ? <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p> : null}
        </div>
        {goal ? (
          <p className="text-muted-foreground border-border bg-elevated rounded-full border px-3 py-1 text-xs">
            {goal}
          </p>
        ) : null}
      </header>

      {settings.showLiveMetrics ? (
        <MetricsBar metrics={session.metrics} remainingMs={session.remainingMs} />
      ) : null}

      <div className="bg-elevated h-2 w-full overflow-hidden rounded-full">
        <div
          className="from-primary via-f9 to-accent h-full bg-gradient-to-r transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="glow-card p-4 sm:p-6 md:p-8">
        <TypingText
          snapshot={session.snapshot}
          fontSize={settings.fontSize}
          caret={settings.caret}
        />
        {!session.snapshot.started ? (
          <p className="text-muted-foreground mt-6 text-sm">
            Start typing on your keyboard — the timer begins with your first keystroke.
          </p>
        ) : null}
      </div>

      {settings.showFingerHints ? <FingerHint {...(nextChar ? { nextChar } : {})} /> : null}

      {settings.showKeyboard ? (
        <VirtualKeyboard
          {...(nextChar ? { nextChar } : {})}
          pressedKeyCode={session.lastKeyCode}
          wrongKeyCode={session.wrongKeyCode}
          showFingerHints={settings.showFingerHints}
        />
      ) : null}
    </div>
  );
}
