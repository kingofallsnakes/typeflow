import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { findLesson } from "@/data/curriculum";
import { recordLessonAttempt } from "@/core/storage/localStore";
import type { SessionResult } from "@/core/typing/typingTypes";

export const Route = createFileRoute("/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson — Cobra" },
      { name: "description", content: "Guided touch typing lesson with live feedback." },
      { property: "og:title", content: "Lesson — Cobra" },
      {
        property: "og:description",
        content: "Guided touch typing lesson with finger hints and live feedback.",
      },
    ],
  }),
  component: LessonPage,
});

function LessonPage() {
  const { lessonId } = useParams({ from: "/lesson/$lessonId" });
  const found = findLesson(lessonId);
  const [drillIndex, setDrillIndex] = useState(0);
  const [attemptKey, setAttemptKey] = useState(0);

  const handleComplete = useCallback(
    (result: SessionResult) => {
      if (!found) return;
      recordLessonAttempt(
        found.lesson.id,
        result.metrics.wpm,
        result.metrics.accuracy,
        found.lesson.minAccuracy,
      );
    },
    [found],
  );

  if (!found) {
    return (
      <AppShell>
        <div className="space-y-4">
          <h1 className="text-2xl font-semibold">Lesson not found</h1>
          <p className="text-muted-foreground">This lesson doesn't exist in the current course.</p>
          <Link to="/learn" className="text-primary underline underline-offset-4">
            Back to the course
          </Link>
        </div>
      </AppShell>
    );
  }

  const { lesson } = found;
  const text = lesson.drills[drillIndex] ?? lesson.drills[0] ?? "";

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {lesson.drills.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => {
                setDrillIndex(index);
                setAttemptKey((value) => value + 1);
              }}
              className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                index === drillIndex
                  ? "border-primary bg-primary/20 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              Drill {index + 1}
            </button>
          ))}
        </div>

        <TypingWorkspace
          key={`${lesson.id}-${drillIndex}-${attemptKey}`}
          text={text}
          mode="lesson"
          lessonId={lesson.id}
          title={lesson.title}
          subtitle={lesson.description}
          goal={`Target accuracy ${lesson.minAccuracy}%`}
          onComplete={handleComplete}
          onRestartRequest={() => setAttemptKey((value) => value + 1)}
        />
      </div>
    </AppShell>
  );
}
