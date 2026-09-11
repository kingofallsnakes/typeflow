import type { SessionMetrics } from "@/core/typing/typingTypes";

export function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div>
      <p className="text-muted-foreground text-[0.7rem] tracking-[0.14em] uppercase">{label}</p>
      <p className="font-mono text-2xl">{value}</p>
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}

export function MetricsBar({
  metrics,
  remainingMs,
}: {
  metrics: SessionMetrics;
  remainingMs?: number | null;
}) {
  return (
    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
      <Stat label="WPM" value={metrics.wpm.toFixed(0)} />
      <Stat label="Accuracy" value={`${metrics.accuracy.toFixed(1)}%`} />
      <Stat label="Errors" value={metrics.incorrectCharacters.toFixed(0)} />
      <Stat
        label={remainingMs != null ? "Time left" : "Time"}
        value={formatDuration(remainingMs ?? metrics.durationMs)}
      />
    </div>
  );
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
