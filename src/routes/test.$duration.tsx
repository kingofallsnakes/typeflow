import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { TypingWorkspace } from "@/components/typing/TypingWorkspace";
import { generateTestText } from "@/core/adaptive/exerciseGenerator";

export const Route = createFileRoute("/test/$duration")({
  head: () => ({
    meta: [
      { title: "Timed typing test — TYPEFLOW" },
      { name: "description", content: "A timed typing test with live WPM, accuracy and errors." },
      { property: "og:title", content: "Timed typing test — TYPEFLOW" },
      { property: "og:description", content: "Live WPM, accuracy and a full result breakdown." },
    ],
  }),
  component: TimedTest,
});

const ALLOWED = [15, 30, 60, 180, 300, 600];

function TimedTest() {
  const { duration } = useParams({ from: "/test/$duration" });
  const seconds = ALLOWED.includes(Number(duration)) ? Number(duration) : 60;
  const [round, setRound] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    setText(generateTestText(Math.max(400, seconds * 12), Date.now() + round));
  }, [seconds, round]);

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
        mode="test"
        durationMs={seconds * 1000}
        title={`${seconds >= 60 ? `${seconds / 60} minute` : `${seconds} second`} test`}
        subtitle="The timer starts on your first keystroke and pauses if you leave the tab."
        goal="Stay steady"
        onRestartRequest={() => setRound((value) => value + 1)}
      />
    </AppShell>
  );
}
