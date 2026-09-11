import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/test/")({
  head: () => ({
    meta: [
      { title: "Typing test — TYPEFLOW" },
      {
        name: "description",
        content: "Timed typing tests from 15 seconds to 10 minutes with a full result breakdown.",
      },
      { property: "og:title", content: "Typing test — TYPEFLOW" },
      { property: "og:description", content: "Measure your WPM, accuracy and consistency." },
    ],
  }),
  component: TestIndex,
});

const DURATIONS = [
  { value: "15", label: "15 seconds" },
  { value: "30", label: "30 seconds" },
  { value: "60", label: "1 minute" },
  { value: "180", label: "3 minutes" },
  { value: "300", label: "5 minutes" },
  { value: "600", label: "10 minutes" },
];

function TestIndex() {
  return (
    <AppShell>
      <h1 className="text-balance-tight text-3xl font-semibold">Typing test</h1>
      <p className="text-muted-foreground mt-2">
        Pick a duration. Results feed your skill profile like any other session.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {DURATIONS.map((duration) => (
          <Link
            key={duration.value}
            to="/test/$duration"
            params={{ duration: duration.value }}
            className="surface-panel hover:border-primary px-5 py-6 text-center font-mono text-lg transition-colors"
          >
            {duration.label}
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
