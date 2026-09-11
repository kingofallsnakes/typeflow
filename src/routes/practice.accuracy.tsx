import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { generateAccuracyText } from "@/core/adaptive/exerciseGenerator";
import { useSettings } from "@/context/SettingsContext";

export const Route = createFileRoute("/practice/accuracy")({
  head: () => ({
    meta: [
      { title: "Accuracy practice — Cobra" },
      {
        name: "description",
        content: "Precision drills: fewer mistakes, fewer backspaces, a steadier rhythm.",
      },
      { property: "og:title", content: "Accuracy practice — Cobra" },
      { property: "og:description", content: "Train precision before speed." },
    ],
  }),
  component: AccuracyPractice,
});

function AccuracyPractice() {
  const { settings } = useSettings();
  const [round, setRound] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    setText(generateAccuracyText(280, Date.now() + round));
  }, [round]);

  if (!text) {
    return (
      <AppShell>
        <div className="bg-elevated h-56 animate-pulse rounded-xl" />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <TypingWorkspace
        key={round}
        text={text}
        mode="accuracy"
        title="Accuracy drill"
        subtitle="Slow down at the point where you usually slip."
        goal={`Target accuracy ${settings.accuracyTarget}%`}
        onRestartRequest={() => setRound((value) => value + 1)}
      />
    </AppShell>
  );
}
