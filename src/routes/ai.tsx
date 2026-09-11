import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Sparkles, Wand2 } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAiLesson } from "@/lib/aiLessons.functions";
import {
  AI_CATEGORIES,
  DIFFICULTIES,
  LENGTHS,
  type DifficultyId,
  type LengthId,
} from "@/data/aiCategories";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Lessons — TYPEFLOW" },
      {
        name: "description",
        content:
          "Generate fresh typing lessons on any topic: animals, space, jokes, coding, sports and more, at four difficulty levels.",
      },
      { property: "og:title", content: "AI Lessons — TYPEFLOW" },
      {
        property: "og:description",
        content: "Endless typing practice generated on any topic you like.",
      },
    ],
  }),
  component: AiLessonsPage,
});

function AiLessonsPage() {
  const [categoryId, setCategoryId] = useState(AI_CATEGORIES[0]!.id);
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<DifficultyId>("medium");
  const [length, setLength] = useState<LengthId>("medium");
  const [attempt, setAttempt] = useState(0);

  const generate = useServerFn(generateAiLesson);
  const mutation = useMutation({
    mutationFn: (input: Parameters<typeof generate>[0]) => generate(input),
  });

  const category = AI_CATEGORIES.find((item) => item.id === categoryId)!;
  const lesson = mutation.data;

  const run = (nextTopic = topic) => {
    setAttempt((value) => value + 1);
    mutation.mutate({
      data: {
        categoryId,
        difficulty,
        length,
        ...(nextTopic.trim() ? { topic: nextTopic.trim() } : {}),
      },
    });
  };

  return (
    <AppShell>
      <div className="space-y-8">
        <header>
          <p className="text-primary flex items-center gap-2 text-xs font-semibold tracking-[0.22em] uppercase">
            <Sparkles className="size-4" aria-hidden /> AI lessons
          </p>
          <h1 className="text-balance-tight mt-2 text-3xl font-semibold sm:text-4xl">
            Type about <span className="gradient-text">anything you like</span>
          </h1>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            Pick a world, choose how hard it should be, and a brand new passage is written for you.
          </p>
        </header>

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {AI_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategoryId(item.id)}
              className={cn(
                "glow-card glow-card-hover p-4 text-left",
                item.id === categoryId && "ring-primary/70 ring-2",
              )}
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="mt-2 block font-medium">{item.label}</span>
              <span className="text-muted-foreground mt-0.5 block text-xs">{item.blurb}</span>
            </button>
          ))}
        </section>

        <section className="glow-card space-y-5 p-4 sm:p-5">
          <div className="flex flex-wrap gap-2">
            {category.topics.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setTopic(item);
                  run(item);
                }}
                className="border-border hover:border-primary hover:text-foreground text-muted-foreground rounded-full border px-3 py-1.5 text-xs transition-colors"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr]">
            <label className="block">
              <span className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
                Your own topic
              </span>
              <Input
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder={`e.g. ${category.topics[0]}`}
                className="mt-2"
              />
            </label>
            <div>
              <span className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
                Difficulty
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {DIFFICULTIES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDifficulty(item.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      item.id === difficulty
                        ? "border-primary bg-primary/20 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
                Length
              </span>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {LENGTHS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLength(item.id)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs transition-colors",
                      item.id === length
                        ? "border-primary bg-primary/20 text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Button size="lg" onClick={() => run()} disabled={mutation.isPending}>
            {mutation.isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Wand2 className="size-4" />
            )}
            {mutation.isPending ? "Writing your lesson…" : "Generate lesson"}
          </Button>

          {mutation.isError ? (
            <p className="border-destructive/50 bg-destructive/10 rounded-lg border p-3 text-sm">
              {(mutation.error as Error).message}
            </p>
          ) : null}
        </section>

        {mutation.isPending ? (
          <div className="glow-card space-y-3 p-6">
            {[0, 1, 2].map((row) => (
              <div key={row} className="bg-elevated shimmer h-4 rounded-full" />
            ))}
          </div>
        ) : null}

        {lesson ? (
          <TypingWorkspace
            key={`${lesson.title}-${attempt}`}
            text={lesson.text}
            mode="ai"
            title={lesson.title}
            subtitle={`${lesson.category} · ${lesson.difficulty}`}
            goal="Fresh text, written just now"
            onRestartRequest={() => setAttempt((value) => value + 1)}
          />
        ) : null}
      </div>
    </AppShell>
  );
}
