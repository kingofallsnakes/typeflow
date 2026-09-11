import { Link } from "@tanstack/react-router";
import { ArrowRight, Coins, Flame, RotateCcw, Star } from "lucide-react";
import type { SessionResult } from "@/core/typing/typingTypes";
import { Stat, formatDuration } from "./MetricsBar";
import { describeSkill, topWeakness, weakestKeys, weakestTransitions } from "@/core/adaptive/skillSelector";
import { loadProfile } from "@/core/storage/localStore";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";

export function ResultSummary({
  result,
  onRestart,
}: {
  result: SessionResult;
  onRestart: () => void;
}) {
  const profile = loadProfile();
  const keys = weakestKeys(profile, 4);
  const transitions = weakestTransitions(profile, 4);
  const next = topWeakness(profile);
  const m = result.metrics;
  const { lastReward, level, streak } = useGame();

  return (
    <section className="space-y-8" aria-live="polite">
      <div className="pop-in">
        <p className="text-primary text-xs font-semibold tracking-[0.2em] uppercase">
          Session complete
        </p>
        <h2 className="text-balance-tight mt-1 text-2xl font-semibold sm:text-4xl">
          {m.wpm.toFixed(0)} WPM · {m.accuracy.toFixed(1)}% accuracy
        </h2>
      </div>

      {lastReward ? (
        <div className="glow-card pop-in p-5">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-primary flex items-center gap-2 text-2xl font-semibold">
              <Star className="size-6" aria-hidden /> +{lastReward.xp} XP
            </span>
            <span className="text-warning flex items-center gap-2 text-lg font-semibold">
              <Coins className="size-5" aria-hidden /> +{lastReward.coins}
            </span>
            <span className="text-muted-foreground flex items-center gap-2 text-sm">
              <Flame className="text-warning size-4" aria-hidden /> {streak} day streak · Level{" "}
              {level.level} {level.title}
            </span>
          </div>
          {lastReward.bonuses.length ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {lastReward.bonuses.map((bonus) => (
                <span
                  key={bonus.label}
                  className="border-accent/40 bg-accent/10 rounded-full border px-3 py-1 text-xs"
                >
                  {bonus.label} +{bonus.xp}
                </span>
              ))}
            </div>
          ) : null}
          <div className="bg-elevated mt-4 h-2 w-full overflow-hidden rounded-full">
            <div
              className="from-primary to-accent h-full bg-gradient-to-r transition-[width] duration-700"
              style={{ width: `${level.percent}%` }}
            />
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            {level.current}/{level.needed} XP to level {level.level + 1}
          </p>
        </div>
      ) : null}


      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
        <Stat label="Characters" value={m.totalKeystrokes.toFixed(0)} />
        <Stat label="Correct" value={m.correctCharacters.toFixed(0)} />
        <Stat label="Errors" value={m.incorrectCharacters.toFixed(0)} />
        <Stat label="Backspaces" value={m.backspaces.toFixed(0)} />
        <Stat label="Consistency" value={`${m.consistency.toFixed(0)}%`} />
        <Stat label="Duration" value={formatDuration(m.durationMs)} />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="surface-panel p-5">
          <h3 className="text-sm tracking-[0.14em] uppercase">Weakest keys</h3>
          {keys.length === 0 ? (
            <p className="text-muted-foreground mt-3 text-sm">
              Not enough data yet — keep typing to build your skill profile.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {keys.map((key) => (
                <li key={key.keyCode} className="flex items-center justify-between">
                  <span className="font-mono text-base">{key.char === " " ? "space" : key.char}</span>
                  <span className="text-muted-foreground">
                    {key.accuracy.toFixed(0)}% · {key.averageIntervalMs.toFixed(0)}ms · mastery{" "}
                    {key.mastery.toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="surface-panel p-5">
          <h3 className="text-sm tracking-[0.14em] uppercase">Weakest transitions</h3>
          {transitions.length === 0 ? (
            <p className="text-muted-foreground mt-3 text-sm">
              Transitions appear once you have typed a few hundred characters.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {transitions.map((t) => (
                <li key={`${t.from}${t.to}`} className="flex items-center justify-between">
                  <span className="font-mono text-base">
                    {t.from} → {t.to}
                  </span>
                  <span className="text-muted-foreground">
                    {t.accuracy.toFixed(0)}% · {t.averageIntervalMs.toFixed(0)}ms · mastery{" "}
                    {t.mastery.toFixed(0)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={onRestart} variant="secondary">
          <RotateCcw className="size-4" /> Try again
        </Button>
        {next ? (
          <Button asChild>
            <Link to="/practice/weakness">
              Practice {describeSkill(next)} <ArrowRight className="size-4" />
            </Link>
          </Button>
        ) : (
          <Button asChild>
            <Link to="/learn">Continue the course</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
