import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Stat } from "@/components/typing/MetricsBar";
import { Button } from "@/components/ui/button";
import { loadProfile, loadSessions } from "@/core/storage/localStore";
import { useSettings } from "@/context/SettingsContext";
import { useGame } from "@/context/GameContext";
import { DailyQuests } from "@/components/game/DailyQuests";
import { nextLessonId } from "@/core/game/placement";
import { loadLessonProgress } from "@/core/storage/localStore";
import {
  describeSkill,
  topWeakness,
  weakestKeys,
  weakestTransitions,
  type WeakSkill,
} from "@/core/adaptive/skillSelector";
import type { SessionResult } from "@/core/typing/typingTypes";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Cobra" },
      {
        name: "description",
        content: "Your typing speed, accuracy, daily goal and the skill you should practise next.",
      },
      { property: "og:title", content: "Dashboard — Cobra" },
      {
        property: "og:description",
        content: "Track today's practice and see the exact skill to work on next.",
      },
    ],
  }),
  component: Dashboard,
});

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const { settings } = useSettings();
  const { level, game, streak, placement } = useGame();
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [weakKeys, setWeakKeys] = useState<ReturnType<typeof weakestKeys>>([]);
  const [weakTransitions, setWeakTransitions] = useState<ReturnType<typeof weakestTransitions>>([]);
  const [next, setNext] = useState<WeakSkill | null>(null);
  const [hello, setHello] = useState("Welcome back");
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  useEffect(() => {
    const profile = loadProfile();
    setSessions(loadSessions());
    setWeakKeys(weakestKeys(profile, 5));
    setWeakTransitions(weakestTransitions(profile, 5));
    setNext(topWeakness(profile));
    setHello(greeting());
    setCompletedIds(
      Object.values(loadLessonProgress())
        .filter((lesson) => lesson.completed)
        .map((lesson) => lesson.lessonId),
    );
  }, []);

  const today = new Date().toDateString();
  const todaySessions = sessions.filter((s) => new Date(s.finishedAt).toDateString() === today);
  const todayMinutes =
    todaySessions.reduce((total, s) => total + s.metrics.durationMs, 0) / 60000;
  const recent = sessions.slice(-10);
  const currentWpm = recent.length
    ? recent.reduce((total, s) => total + s.metrics.wpm, 0) / recent.length
    : 0;
  const bestWpm = sessions.reduce((best, s) => Math.max(best, s.metrics.wpm), 0);
  const accuracy = recent.length
    ? recent.reduce((total, s) => total + s.metrics.accuracy, 0) / recent.length
    : 0;
  const totalMinutes = sessions.reduce((total, s) => total + s.metrics.durationMs, 0) / 60000;
  const goalPercent = Math.min(100, (todayMinutes / settings.dailyGoalMinutes) * 100);

  return (
    <AppShell>
      <div className="space-y-12">
        <section className="glow-card p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
            <div>
              <h1 className="text-balance-tight text-3xl font-semibold sm:text-4xl">
                {hello}, <span className="gradient-text">Level {level.level}</span>
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                {level.title} · {game.coins} coins ·{" "}
                {streak > 0 ? `${streak} day streak 🔥` : "start a streak today"}
              </p>
            </div>
            <div className="w-full sm:max-w-xs">
              <p className="text-muted-foreground flex justify-between text-xs">
                <span>
                  Daily goal {todayMinutes.toFixed(1)}/{settings.dailyGoalMinutes} min
                </span>
                <span>{goalPercent.toFixed(0)}%</span>
              </p>
              <div className="bg-elevated mt-2 h-2.5 w-full overflow-hidden rounded-full">
                <div
                  className="from-primary to-accent h-full bg-gradient-to-r transition-all duration-700"
                  style={{ width: `${goalPercent}%` }}
                />
              </div>
              <p className="text-muted-foreground mt-3 flex justify-between text-xs">
                <span>XP to level {level.level + 1}</span>
                <span>
                  {level.current}/{level.needed}
                </span>
              </p>
              <div className="bg-elevated mt-2 h-2.5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-warning h-full transition-all duration-700"
                  style={{ width: `${level.percent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-5 sm:gap-8 lg:grid-cols-[1.1fr_1fr]">
          <div className="glow-card flex flex-col justify-between gap-4 p-5 sm:p-6">
            <div>
              <h2 className="text-sm tracking-[0.14em] uppercase">Your path</h2>
              {placement.stage ? (
                <p className="text-muted-foreground mt-3 text-sm">
                  You're a <span className="text-foreground font-medium">{placement.stage}</span>{" "}
                  typist. Next up on your path:
                </p>
              ) : (
                <p className="text-muted-foreground mt-3 text-sm">
                  Take the one-minute level check and we'll unlock the lessons that fit you.
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link
                  to="/lesson/$lessonId"
                  params={{ lessonId: nextLessonId(placement, completedIds) }}
                >
                  Continue path <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/placement">{placement.stage ? "Retake level check" : "Find my level"}</Link>
              </Button>
            </div>
          </div>
          <DailyQuests />
        </section>

        <section className="grid grid-cols-2 gap-5 sm:gap-8 sm:grid-cols-4">
          <Stat label="Current WPM" value={currentWpm.toFixed(0)} hint="last 10 sessions" />
          <Stat label="Best WPM" value={bestWpm.toFixed(0)} />
          <Stat label="Accuracy" value={`${accuracy.toFixed(1)}%`} hint="last 10 sessions" />
          <Stat label="Typing time" value={`${totalMinutes.toFixed(0)}m`} />
        </section>

        {sessions.length === 0 ? (
          <section className="glow-card p-8 text-center">
            <h2 className="text-xl font-semibold">No practice sessions yet</h2>
            <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
              Every number on this page comes from your own typing. Start your first lesson and the
              engine will begin building your skill profile.
            </p>
            <Button asChild className="mt-6">
              <Link to="/learn">Start your first lesson</Link>
            </Button>
          </section>
        ) : (
          <section className="grid gap-5 sm:gap-8 lg:grid-cols-[1fr_1fr_1.1fr]">
            <div className="glow-card p-5">
              <h2 className="text-sm tracking-[0.14em] uppercase">Weakest keys</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {weakKeys.map((key) => (
                  <li key={key.keyCode} className="flex justify-between">
                    <span className="font-mono text-base">
                      {key.char === " " ? "space" : key.char}
                    </span>
                    <span className="text-muted-foreground">{key.accuracy.toFixed(0)}%</span>
                  </li>
                ))}
                {weakKeys.length === 0 && (
                  <li className="text-muted-foreground">Keep typing to collect key data.</li>
                )}
              </ul>
            </div>

            <div className="glow-card p-5">
              <h2 className="text-sm tracking-[0.14em] uppercase">Weakest transitions</h2>
              <ul className="mt-4 space-y-2 text-sm">
                {weakTransitions.map((t) => (
                  <li key={`${t.from}${t.to}`} className="flex justify-between">
                    <span className="font-mono text-base">
                      {t.from} → {t.to}
                    </span>
                    <span className="text-muted-foreground">
                      {t.averageIntervalMs.toFixed(0)}ms
                    </span>
                  </li>
                ))}
                {weakTransitions.length === 0 && (
                  <li className="text-muted-foreground">Transitions need a few hundred keys.</li>
                )}
              </ul>
            </div>

            <div className="glow-card flex flex-col justify-between p-5">
              <div>
                <h2 className="text-sm tracking-[0.14em] uppercase">Current problem</h2>
                {next ? (
                  <>
                    <p className="mt-3 font-mono text-3xl">{describeSkill(next)}</p>
                    <p className="text-muted-foreground mt-2 text-sm">
                      Accuracy {next.accuracy.toFixed(0)}% · average{" "}
                      {next.averageIntervalMs.toFixed(0)}ms · mastery {next.mastery.toFixed(0)}/100
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mt-3 text-sm">
                    Not enough signal yet — practise a lesson to reveal your weak spots.
                  </p>
                )}
              </div>
              <Button asChild className="mt-6 self-start">
                <Link to="/practice/weakness">
                  Start practice <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </AppShell>
  );
}
