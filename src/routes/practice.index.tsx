import { createFileRoute, Link } from "@tanstack/react-router";
import { Gauge, Crosshair, Target, PenLine, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/practice/")({
  head: () => ({
    meta: [
      { title: "Practice modes — Cobra" },
      {
        name: "description",
        content:
          "Choose weakness drills, speed runs, accuracy work, AI lessons or free practice with your own text.",
      },
      { property: "og:title", content: "Practice modes — Cobra" },
      {
        property: "og:description",
        content: "Weakness drills, speed runs, accuracy work, AI lessons and free practice.",
      },
    ],
  }),
  component: PracticeIndex,
});

const MODES = [
  {
    to: "/practice/weakness",
    icon: Target,
    title: "Weakness",
    emoji: "🎯",
    body: "The engine picks your lowest-mastery key or transition and builds a drill around it.",
  },
  {
    to: "/practice/speed",
    icon: Gauge,
    title: "Speed",
    emoji: "⚡",
    body: "Push your words per minute while keeping accuracy above your threshold.",
  },
  {
    to: "/practice/accuracy",
    icon: Crosshair,
    title: "Accuracy",
    emoji: "💎",
    body: "Precision first: fewer errors, fewer backspaces, a steadier rhythm.",
  },
  {
    to: "/ai",
    icon: Sparkles,
    title: "AI lessons",
    emoji: "✨",
    body: "Any topic you like — animals, space, jokes, coding — written fresh for you.",
  },
  {
    to: "/practice/free",
    icon: PenLine,
    title: "Free practice",
    emoji: "📝",
    body: "Paste or write your own text and practise on exactly what you care about.",
  },
] as const;

function PracticeIndex() {
  return (
    <AppShell>
      <h1 className="text-balance-tight text-3xl font-semibold sm:text-4xl">
        Pick your <span className="gradient-text">training mode</span>
      </h1>
      <p className="text-muted-foreground mt-2">
        Five ways to train. Every session earns XP and feeds the same skill profile.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODES.map(({ to, icon: Icon, title, body, emoji }) => (
          <Link key={to} to={to} className="glow-card glow-card-hover p-5">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{emoji}</span>
              <Icon className="text-primary size-5" aria-hidden />
            </div>
            <h2 className="mt-3 text-lg font-semibold">{title}</h2>
            <p className="text-muted-foreground mt-1.5 text-sm">{body}</p>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
