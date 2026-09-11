import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { sanitizeText } from "@/core/adaptive/exerciseGenerator";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/practice/free")({
  head: () => ({
    meta: [
      { title: "Free practice — Cobra" },
      { name: "description", content: "Practise on your own text: paste it, clean it up, type it." },
      { property: "og:title", content: "Free practice — Cobra" },
      { property: "og:description", content: "Bring your own text and practise on it." },
    ],
  }),
  component: FreePractice,
});

function FreePractice() {
  const [draft, setDraft] = useState("");
  const [text, setText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = () => {
    const cleaned = sanitizeText(draft);
    if (cleaned.length < 20) {
      setError("Please provide at least 20 characters of plain text.");
      return;
    }
    setError(null);
    setText(cleaned);
  };

  if (text) {
    return (
      <AppShell>
        <div className="space-y-6">
          <Button variant="ghost" onClick={() => setText(null)}>
            ← Choose different text
          </Button>
          <TypingWorkspace
            text={text}
            mode="free"
            title="Free practice"
            subtitle="Your own text, measured exactly like every other session."
          />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-2xl space-y-5">
        <div>
          <h1 className="text-balance-tight text-3xl font-semibold">Free practice</h1>
          <p className="text-muted-foreground mt-2">
            Paste any plain text. Line breaks and unusual characters are stripped so the exercise
            stays typeable.
          </p>
        </div>
        <label htmlFor="free-text" className="text-sm font-medium">
          Your text
        </label>
        <textarea
          id="free-text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={8}
          className="border-border bg-surface focus:ring-primary w-full rounded-lg border p-4 font-mono text-sm outline-none focus:ring-2"
          placeholder="Paste a paragraph you want to practise…"
        />
        {error ? (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        ) : null}
        <Button onClick={start}>Start practice</Button>
      </div>
    </AppShell>
  );
}
