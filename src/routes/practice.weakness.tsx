import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { loadProfile } from "@/core/storage/localStore";
import { describeSkill, topWeakness, type WeakSkill } from "@/core/adaptive/skillSelector";
import { generateForSkill } from "@/core/adaptive/exerciseGenerator";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/practice/weakness")({
  head: () => ({
    meta: [
      { title: "Weakness practice — TYPEFLOW" },
      {
        name: "description",
        content: "Targeted drills generated from your weakest keys and slowest key transitions.",
      },
      { property: "og:title", content: "Weakness practice — TYPEFLOW" },
      {
        property: "og:description",
        content: "Drills built from your own error data, not random words.",
      },
    ],
  }),
  component: WeaknessPractice,
});

function WeaknessPractice() {
  const [skill, setSkill] = useState<WeakSkill | null>(null);
  const [text, setText] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [round, setRound] = useState(0);

  useEffect(() => {
    const weakest = topWeakness(loadProfile());
    setSkill(weakest);
    setText(
      weakest
        ? generateForSkill(weakest, {
            level: weakest.mastery < 40 ? 3 : weakest.mastery < 70 ? 5 : 6,
            seed: Date.now() + round,
          })
        : null,
    );
    setReady(true);
  }, [round]);

  if (!ready) {
    return (
      <AppShell>
        <div className="bg-elevated h-56 w-full animate-pulse rounded-xl" />
      </AppShell>
    );
  }

  if (!skill || !text) {
    return (
      <AppShell>
        <div className="surface-panel p-8 text-center">
          <h1 className="text-xl font-semibold">No weaknesses detected yet</h1>
          <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
            The engine needs real keystrokes before it can find your weak spots. Complete a lesson
            or a short test first.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Button asChild>
              <Link to="/learn">Start a lesson</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link to="/test">Take a test</Link>
            </Button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6">
        <p className="text-muted-foreground text-sm">
          Your weakest skill right now is{" "}
          <span className="text-foreground font-mono">{describeSkill(skill)}</span> — accuracy{" "}
          {skill.accuracy.toFixed(0)}%, average {skill.averageIntervalMs.toFixed(0)}ms.
        </p>
        <TypingWorkspace
          key={round}
          text={text}
          mode="weakness"
          title={`Drill: ${describeSkill(skill)}`}
          subtitle="Generated from your own error history."
          goal={`Mastery ${skill.mastery.toFixed(0)}/100`}
          onRestartRequest={() => setRound((value) => value + 1)}
        />
      </div>
    </AppShell>
  );
}
