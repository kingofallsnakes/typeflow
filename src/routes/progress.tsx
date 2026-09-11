import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/AppShell";
import { loadSessions } from "@/core/storage/localStore";
import type { SessionResult } from "@/core/typing/typingTypes";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — TYPEFLOW" },
      {
        name: "description",
        content: "Charts of your typing speed, accuracy and practice time over days and months.",
      },
      { property: "og:title", content: "Progress — TYPEFLOW" },
      { property: "og:description", content: "See how your speed and accuracy trend over time." },
    ],
  }),
  component: ProgressPage,
});

const RANGES = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
  { label: "All time", days: 0 },
];

interface DayPoint {
  date: string;
  wpm: number;
  accuracy: number;
  minutes: number;
  characters: number;
}

function aggregate(sessions: SessionResult[], days: number): DayPoint[] {
  const cutoff = days > 0 ? Date.now() - days * 86_400_000 : 0;
  const buckets = new Map<string, SessionResult[]>();
  for (const session of sessions) {
    if (session.finishedAt < cutoff) continue;
    const key = format(new Date(session.finishedAt), "yyyy-MM-dd");
    buckets.set(key, [...(buckets.get(key) ?? []), session]);
  }
  return [...buckets.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({
      date: format(new Date(date), "MMM d"),
      wpm: items.reduce((total, s) => total + s.metrics.wpm, 0) / items.length,
      accuracy: items.reduce((total, s) => total + s.metrics.accuracy, 0) / items.length,
      minutes: items.reduce((total, s) => total + s.metrics.durationMs, 0) / 60000,
      characters: items.reduce((total, s) => total + s.metrics.totalKeystrokes, 0),
    }));
}

function ProgressPage() {
  const [sessions, setSessions] = useState<SessionResult[]>([]);
  const [rangeDays, setRangeDays] = useState(30);
  useEffect(() => setSessions(loadSessions()), []);

  const data = useMemo(() => aggregate(sessions, rangeDays), [sessions, rangeDays]);

  return (
    <AppShell>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-balance-tight text-3xl font-semibold">Progress</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              {sessions.length} recorded sessions on this device.
            </p>
          </div>
          <div className="flex gap-2">
            {RANGES.map((range) => (
              <button
                key={range.label}
                type="button"
                onClick={() => setRangeDays(range.days)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  rangeDays === range.days
                    ? "border-primary bg-primary/20 text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {data.length === 0 ? (
          <div className="surface-panel p-8 text-center">
            <h2 className="text-xl font-semibold">Nothing to chart yet</h2>
            <p className="text-muted-foreground mt-2 text-sm">
              Complete a lesson or test and your history will appear here.
            </p>
            <Button asChild className="mt-6">
              <Link to="/learn">Start your first lesson</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            <ChartCard title="Words per minute">
              <LineChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="wpm"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartCard>

            <ChartCard title="Accuracy %">
              <LineChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis domain={[60, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Line
                  type="monotone"
                  dataKey="accuracy"
                  stroke="var(--color-accent)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartCard>

            <ChartCard title="Practice minutes">
              <AreaChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="minutes"
                  stroke="var(--color-primary)"
                  fill="color-mix(in oklab, var(--color-primary) 25%, transparent)"
                />
              </AreaChart>
            </ChartCard>

            <ChartCard title="Characters typed">
              <AreaChart data={data}>
                <CartesianGrid stroke="var(--color-border)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area
                  type="monotone"
                  dataKey="characters"
                  stroke="var(--color-warning)"
                  fill="color-mix(in oklab, var(--color-warning) 22%, transparent)"
                />
              </AreaChart>
            </ChartCard>
          </div>
        )}
      </div>
    </AppShell>
  );
}

const tooltipStyle = {
  background: "var(--color-elevated)",
  border: "1px solid var(--color-border)",
  borderRadius: "0.5rem",
  color: "var(--color-foreground)",
  fontSize: 12,
};

function ChartCard({ title, children }: { title: string; children: React.ReactElement }) {
  return (
    <section className="surface-panel p-5">
      <h2 className="text-sm tracking-[0.14em] uppercase">{title}</h2>
      <div className="mt-4 h-56">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </section>
  );
}
