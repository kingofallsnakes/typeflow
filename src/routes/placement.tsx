import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Compass, Rocket } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { useGame } from "@/context/GameContext";
import {
  PLACEMENT_TEXT,
  allLessons,
  gradePlacement,
  type PlacementResult,
} from "@/core/game/placement";
import type { SessionResult } from "@/core/typing/typingTypes";

export const Route = createFileRoute("/placement")({
  head: () => ({
    meta: [
      { title: "Find your level — TYPEFLOW placement test" },
      {
        name: "description",
        content: "A one-minute typing check that picks the right starting lesson for you.",
      },
      { property: "og:title", content: "Find your level — TYPEFLOW" },
      {
        property: "og:description",
        content: "Take a short typing check and unlock the lessons that match your skill.",
      },
    ],
  }),
  component: PlacementPage,
});

function PlacementPage() {
  const { placement, savePlacementResult } = useGame();
  const [started, setStarted] = useState(false);
  const [result, setResult] = useState<PlacementResult | null>(null);
  const lessons = allLessons();

  function onComplete(session: SessionResult) {
    const grade = gradePlacement(session.metrics.wpm, session.metrics.accuracy);
    const placementResult: PlacementResult = {
      wpm: session.metrics.wpm,
      accuracy: session.metrics.accuracy,
      unlockedUpTo: grade.unlockedUpTo,
      stage: grade.stage,
      completedAt: Date.now(),
    };
    setResult(placementResult);
    savePlacementResult(placementResult);
  }

  if (result) {
    const startLesson = lessons[Math.max(0, result.unlockedUpTo - 1)] ?? lessons[0];
    return (
      <AppShell>
        <div className="glow-card pop-in mx-auto max-w-xl space-y-5 p-6 text-center sm:p-8">
          <p className="text-5xl">🎯</p>
          <h1 className="text-balance-tight text-2xl font-semibold sm:text-3xl">
            You're a {result.stage} typist
          </h1>
          <p className="text-muted-foreground">
            {result.wpm.toFixed(0)} words per minute at {result.accuracy.toFixed(0)}% accuracy. We
            opened {result.unlockedUpTo} lessons on your path.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/learn">
                <Rocket className="size-4" aria-hidden /> Start my path
              </Link>
            </Button>
            {startLesson && (
              <Button variant="outline" asChild>
                <Link to="/lesson/$lessonId" params={{ lessonId: startLesson.id }}>
                  Jump to {startLesson.title}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </AppShell>
    );
  }

  if (started) {
    return (
      <AppShell>
        <TypingWorkspace
          text={PLACEMENT_TEXT}
          mode="placement"
          title="Placement check"
          subtitle="Type at your natural speed — mistakes are fine."
          onComplete={onComplete}
        />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="glow-card mx-auto max-w-xl space-y-5 p-6 text-center sm:p-8">
        <Compass className="text-primary mx-auto size-10" aria-hidden />
        <h1 className="text-balance-tight text-2xl font-semibold sm:text-3xl">Find your level</h1>
        <p className="text-muted-foreground">
          Type one short paragraph and we'll unlock the lessons that match you, so you never start
          too easy or too hard.
        </p>
        {placement.stage && (
          <p className="text-muted-foreground text-sm">
            Last result: {placement.stage} · {Math.round(placement.wpm ?? 0)} wpm
          </p>
        )}
        <Button onClick={() => setStarted(true)}>Start the check</Button>
      </div>
    </AppShell>
  );
}
