import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Circle, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { COURSES } from "@/data/curriculum";
import { loadLessonProgress, type LessonProgress } from "@/core/storage/localStore";
import { useGame } from "@/context/GameContext";
import { allLessons, unlockedCount } from "@/core/game/placement";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/learn")({
  head: () => ({
    meta: [
      { title: "Learn — TYPEFLOW touch typing course" },
      {
        name: "description",
        content:
          "A structured touch typing course: home row, top row, bottom row, punctuation and full sentences.",
      },
      { property: "og:title", content: "Learn — TYPEFLOW touch typing course" },
      {
        property: "og:description",
        content: "Work through the home row to fluent sentences, one guided lesson at a time.",
      },
    ],
  }),
  component: LearnPage,
});

function LearnPage() {
  const [progress, setProgress] = useState<Record<string, LessonProgress>>({});
  const { placement } = useGame();
  useEffect(() => setProgress(loadLessonProgress()), []);

  const completedIds = Object.values(progress)
    .filter((lesson) => lesson.completed)
    .map((lesson) => lesson.lessonId);
  const open = unlockedCount(placement, completedIds);
  const order = allLessons().map((lesson) => lesson.id);

  return (
    <AppShell>
      <div className="space-y-10">
        {!placement.stage && (
          <div className="glow-card flex flex-wrap items-center justify-between gap-4 p-5">
            <p className="text-sm">
              Not sure where to start? Take a one-minute check and we'll open the right lessons.
            </p>
            <Button asChild>
              <Link to="/placement">Find my level</Link>
            </Button>
          </div>
        )}
        {COURSES.map((course) => (
          <section key={course.id}>
            <h1 className="text-balance-tight text-3xl font-semibold">{course.title}</h1>
            <p className="text-muted-foreground mt-2">{course.description}</p>

            <ol className="mt-8 divide-y divide-[var(--color-border)]">
              {course.lessons.map((lesson, index) => {
                const record = progress[lesson.id];
                const done = record?.completed ?? false;
                const locked = order.indexOf(lesson.id) >= open;
                if (locked) {
                  return (
                    <li key={lesson.id}>
                      <div className="-mx-3 flex items-center gap-4 rounded-lg px-3 py-4 opacity-50">
                        <Lock className="text-muted-foreground size-5 shrink-0" aria-hidden />
                        <span className="text-muted-foreground w-24 shrink-0 text-xs tracking-[0.14em] uppercase">
                          {lesson.level}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-medium">
                            {index + 1}. {lesson.title}
                          </span>
                          <span className="text-muted-foreground block truncate text-sm">
                            Finish the lesson before this one to unlock it.
                          </span>
                        </span>
                      </div>
                    </li>
                  );
                }
                return (
                  <li key={lesson.id}>
                    <Link
                      to="/lesson/$lessonId"
                      params={{ lessonId: lesson.id }}
                      className="hover:bg-surface -mx-3 flex items-center gap-4 rounded-lg px-3 py-4 transition-colors"
                    >
                      {done ? (
                        <CheckCircle2 className="text-accent size-5 shrink-0" aria-hidden />
                      ) : (
                        <Circle className="text-muted-foreground size-5 shrink-0" aria-hidden />
                      )}
                      <span className="text-muted-foreground w-24 shrink-0 text-xs tracking-[0.14em] uppercase">
                        {lesson.level}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block font-medium">
                          {index + 1}. {lesson.title}
                        </span>
                        <span className="text-muted-foreground block truncate text-sm">
                          {lesson.description}
                        </span>
                      </span>
                      <span className="text-muted-foreground hidden text-right text-xs sm:block">
                        {record
                          ? `${record.bestWpm.toFixed(0)} wpm · ${record.bestAccuracy.toFixed(0)}%`
                          : "Not started"}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
