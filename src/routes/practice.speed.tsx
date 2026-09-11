import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { generateSpeedText } from "@/core/adaptive/exerciseGenerator";
import { loadSessions } from "@/core/storage/localStore";
import { useSettings } from "@/context/SettingsContext";

export const Route = createFileRoute("/practice/speed")({
  head: () => ({
    meta: [
      { title: "Speed practice — Cobra" },
      {
        name: "description",
        content: "Push your words per minute while holding your accuracy threshold.",
      },
      { property: "og:title", content: "Speed practice — Cobra" },
      { property: "og:description", content: "Raise your WPM without sacrificing accuracy." },
    ],
  }),
  component: SpeedPractice,
});

function SpeedPractice() {
  const { settings } = useSettings();
  const [round, setRound] = useState(0);
  const [text, setText] = useState("");
  const [best, setBest] = useState(0);

  useEffect(() => {
    setText(generateSpeedText(320, Date.now() + round));
    setBest(loadSessions().reduce((max, s) => Math.max(max, s.metrics.wpm), 0));
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
        mode="speed"
        title="Speed run"
        subtitle={`Personal best ${best.toFixed(0)} WPM. Keep accuracy above ${settings.accuracyTarget - 5}%.`}
        goal="Fast, not reckless"
        onRestartRequest={() => setRound((value) => value + 1)}
      />
    </AppShell>
  );
}
