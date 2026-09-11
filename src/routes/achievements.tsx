import { createFileRoute } from "@tanstack/react-router";
import { Coins, Flame, Lock, Star } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useGame } from "@/context/GameContext";
import { BADGES } from "@/core/game/gamification";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/achievements")({
  head: () => ({
    meta: [
      { title: "Badges — TYPEFLOW" },
      {
        name: "description",
        content:
          "Collect badges, levels, coins and streaks earned from real typing practice in TYPEFLOW.",
      },
      { property: "og:title", content: "Badges — TYPEFLOW" },
      {
        property: "og:description",
        content: "Levels, coins, streaks and badges earned from real typing.",
      },
    ],
  }),
  component: AchievementsPage,
});

const TIER_STYLE = {
  bronze: "border-f2/50 bg-f2/10",
  silver: "border-f5/60 bg-f5/10",
  gold: "border-warning/60 bg-warning/10",
} as const;

function AchievementsPage() {
  const { badgeContext, game, level, streak, ready } = useGame();

  if (!ready) {
    return (
      <AppShell>
        <div className="bg-elevated h-64 animate-pulse rounded-2xl" />
      </AppShell>
    );
  }

  const unlocked = BADGES.filter((badge) => badge.reached(badgeContext) >= badge.goal).length;

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <h1 className="text-balance-tight text-3xl font-semibold sm:text-4xl">
            Your <span className="gradient-text">badge shelf</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {unlocked} of {BADGES.length} unlocked — every one earned from real typing.
          </p>
        </header>

        <section className="grid gap-4 sm:grid-cols-3">
          <div className="glow-card p-5">
            <Star className="text-primary size-5" aria-hidden />
            <p className="mt-3 text-3xl font-semibold">Level {level.level}</p>
            <p className="text-muted-foreground text-sm">{level.title}</p>
            <div className="bg-elevated mt-3 h-2 overflow-hidden rounded-full">
              <div
                className="from-primary to-accent h-full bg-gradient-to-r"
                style={{ width: `${level.percent}%` }}
              />
            </div>
          </div>
          <div className="glow-card p-5">
            <Flame className={cn("text-warning size-5", streak > 0 && "flame")} aria-hidden />
            <p className="mt-3 text-3xl font-semibold">{streak} days</p>
            <p className="text-muted-foreground text-sm">Best streak {game.bestStreak} days</p>
          </div>
          <div className="glow-card p-5">
            <Coins className="text-warning size-5" aria-hidden />
            <p className="mt-3 text-3xl font-semibold">{game.coins}</p>
            <p className="text-muted-foreground text-sm">Coins collected · {game.xp} XP total</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const reached = badge.reached(badgeContext);
            const earned = reached >= badge.goal;
            const percent = Math.min(100, (reached / badge.goal) * 100);
            return (
              <article
                key={badge.code}
                className={cn(
                  "rounded-2xl border p-5 transition-transform hover:-translate-y-1",
                  earned ? TIER_STYLE[badge.tier] : "border-border bg-surface opacity-70",
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn("text-3xl", !earned && "grayscale")}>
                    {earned ? badge.emoji : <Lock className="text-muted-foreground size-6" />}
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold">{badge.title}</h2>
                    <p className="text-muted-foreground mt-1 text-sm">{badge.description}</p>
                  </div>
                </div>
                <div className="bg-elevated mt-4 h-1.5 overflow-hidden rounded-full">
                  <div
                    className={cn("h-full", earned ? "bg-warning" : "bg-primary")}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-muted-foreground mt-2 font-mono text-xs">
                  {earned
                    ? "Unlocked"
                    : `${Math.floor(reached)}/${badge.goal}${badge.unit ? ` ${badge.unit}` : ""}`}
                </p>
              </article>
            );
          })}
        </section>
      </div>
    </AppShell>
  );
}
