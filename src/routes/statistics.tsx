import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { AppShell } from "@/components/layout/AppShell";
import { loadProfile, loadSessions } from "@/core/storage/localStore";
import {
  averageInterval,
  keyAccuracy,
  transitionAccuracy,
  emptyProfile,
  type SkillProfile,
} from "@/core/adaptive/skillProfile";
import type { SkillStatus } from "@/core/adaptive/mastery";
import type { SessionResult } from "@/core/typing/typingTypes";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/statistics")({
  head: () => ({
    meta: [
      { title: "Statistics — TYPEFLOW" },
      {
        name: "description",
        content: "Per-key and per-transition accuracy, speed and mastery, plus full session history.",
      },
      { property: "og:title", content: "Statistics — TYPEFLOW" },
      { property: "og:description", content: "Every key and key-pair scored from your own typing." },
    ],
  }),
  component: StatisticsPage,
});

const STATUS_STYLE: Record<SkillStatus, string> = {
  NEEDS_PRACTICE: "text-destructive",
  LEARNING: "text-warning",
  REVIEW: "text-primary",
  MASTERED: "text-accent",
};

function StatisticsPage() {
  const [profile, setProfile] = useState<SkillProfile>(emptyProfile());
  const [sessions, setSessions] = useState<SessionResult[]>([]);

  useEffect(() => {
    setProfile(loadProfile());
    setSessions(loadSessions());
  }, []);

  const keys = Object.values(profile.keys).sort((a, b) => a.mastery - b.mastery);
  const transitions = Object.values(profile.transitions)
    .sort((a, b) => a.mastery - b.mastery)
    .slice(0, 40);

  if (keys.length === 0) {
    return (
      <AppShell>
        <div className="surface-panel p-8 text-center">
          <h1 className="text-xl font-semibold">No statistics yet</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Key and transition data appears as soon as you finish your first session.
          </p>
          <Button asChild className="mt-6">
            <Link to="/learn">Start your first lesson</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-12">
        <section>
          <h1 className="text-balance-tight text-3xl font-semibold">Statistics</h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Mastery combines accuracy, speed, consistency and recency, weighted by sample size.
          </p>
        </section>

        <section>
          <h2 className="text-sm tracking-[0.14em] uppercase">Key performance</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm whitespace-nowrap">
              <thead className="text-muted-foreground text-left text-xs uppercase">
                <tr>
                  <th className="py-2 font-normal">Key</th>
                  <th className="py-2 font-normal">Attempts</th>
                  <th className="py-2 font-normal">Accuracy</th>
                  <th className="py-2 font-normal">Avg speed</th>
                  <th className="py-2 font-normal">Mastery</th>
                  <th className="py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {keys.map((key) => (
                  <tr key={key.keyCode}>
                    <td className="py-2 font-mono text-base">
                      {key.char === " " ? "space" : key.char}
                    </td>
                    <td className="py-2">{key.attempts}</td>
                    <td className="py-2">{keyAccuracy(key).toFixed(1)}%</td>
                    <td className="py-2">
                      {averageInterval(key.totalIntervalMs, key.attempts).toFixed(0)}ms
                    </td>
                    <td className="py-2">{key.mastery.toFixed(0)}</td>
                    <td className={`py-2 ${STATUS_STYLE[key.status]}`}>
                      {key.status.replace("_", " ").toLowerCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm tracking-[0.14em] uppercase">Transitions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm whitespace-nowrap">
              <thead className="text-muted-foreground text-left text-xs uppercase">
                <tr>
                  <th className="py-2 font-normal">Transition</th>
                  <th className="py-2 font-normal">Attempts</th>
                  <th className="py-2 font-normal">Accuracy</th>
                  <th className="py-2 font-normal">Avg speed</th>
                  <th className="py-2 font-normal">Mastery</th>
                  <th className="py-2 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {transitions.map((t) => (
                  <tr key={`${t.from}${t.to}`}>
                    <td className="py-2 font-mono text-base">
                      {t.from} → {t.to}
                    </td>
                    <td className="py-2">{t.attempts}</td>
                    <td className="py-2">{transitionAccuracy(t).toFixed(1)}%</td>
                    <td className="py-2">
                      {averageInterval(t.totalIntervalMs, t.attempts).toFixed(0)}ms
                    </td>
                    <td className="py-2">{t.mastery.toFixed(0)}</td>
                    <td className={`py-2 ${STATUS_STYLE[t.status]}`}>
                      {t.status.replace("_", " ").toLowerCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 className="text-sm tracking-[0.14em] uppercase">Session history</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-sm whitespace-nowrap">
              <thead className="text-muted-foreground text-left text-xs uppercase">
                <tr>
                  <th className="py-2 font-normal">Date</th>
                  <th className="py-2 font-normal">Mode</th>
                  <th className="py-2 font-normal">Duration</th>
                  <th className="py-2 font-normal">WPM</th>
                  <th className="py-2 font-normal">Accuracy</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {[...sessions]
                  .reverse()
                  .slice(0, 40)
                  .map((session) => (
                    <tr key={session.id}>
                      <td className="py-2">
                        {format(new Date(session.finishedAt), "MMM d, HH:mm")}
                      </td>
                      <td className="py-2 capitalize">{session.mode}</td>
                      <td className="py-2">{(session.metrics.durationMs / 1000).toFixed(0)}s</td>
                      <td className="py-2">{session.metrics.wpm.toFixed(0)}</td>
                      <td className="py-2">{session.metrics.accuracy.toFixed(1)}%</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
