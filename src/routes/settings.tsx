import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { useSettings } from "@/context/SettingsContext";
import { clearAllData } from "@/core/storage/localStore";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Cobra" },
      {
        name: "description",
        content: "Theme, keyboard hints, caret style, font size, daily goal and accuracy target.",
      },
      { property: "og:title", content: "Settings — Cobra" },
      { property: "og:description", content: "Tune the interface and your practice targets." },
    ],
  }),
  component: SettingsPage,
});

function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-border flex items-center justify-between gap-6 border-b py-4">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
      </div>
      {children}
    </div>
  );
}

function SettingsPage() {
  const { settings, update, reset } = useSettings();
  const [cleared, setCleared] = useState(false);

  return (
    <AppShell>
      <div className="max-w-2xl">
        <h1 className="text-balance-tight text-3xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Stored on this device. Nothing here is sent anywhere.
        </p>

        <div className="mt-8">
          <Row label="Theme">
            <select
              aria-label="Theme"
              value={settings.theme}
              onChange={(event) => update({ theme: event.target.value as typeof settings.theme })}
              className="border-border bg-surface rounded-md border px-3 py-1.5 text-sm"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </Row>

          <Row label="Keyboard layout" hint="More layouts are planned.">
            <select
              aria-label="Keyboard layout"
              value={settings.layout}
              onChange={(event) => update({ layout: event.target.value })}
              className="border-border bg-surface rounded-md border px-3 py-1.5 text-sm"
            >
              <option value="us-qwerty">US QWERTY</option>
            </select>
          </Row>

          <Row label="Show virtual keyboard">
            <Switch
              checked={settings.showKeyboard}
              onCheckedChange={(value) => update({ showKeyboard: value })}
              aria-label="Show virtual keyboard"
            />
          </Row>

          <Row label="Show finger hints">
            <Switch
              checked={settings.showFingerHints}
              onCheckedChange={(value) => update({ showFingerHints: value })}
              aria-label="Show finger hints"
            />
          </Row>

          <Row label="Show live metrics" hint="Hide them if the numbers distract you.">
            <Switch
              checked={settings.showLiveMetrics}
              onCheckedChange={(value) => update({ showLiveMetrics: value })}
              aria-label="Show live metrics"
            />
          </Row>

          <Row label="Caret style">
            <select
              aria-label="Caret style"
              value={settings.caret}
              onChange={(event) => update({ caret: event.target.value as typeof settings.caret })}
              className="border-border bg-surface rounded-md border px-3 py-1.5 text-sm"
            >
              <option value="line">Line</option>
              <option value="block">Block</option>
              <option value="underline">Underline</option>
            </select>
          </Row>

          <Row label="Font size">
            <select
              aria-label="Font size"
              value={settings.fontSize}
              onChange={(event) =>
                update({ fontSize: event.target.value as typeof settings.fontSize })
              }
              className="border-border bg-surface rounded-md border px-3 py-1.5 text-sm"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>
          </Row>

          <Row label="Daily goal">
            <select
              aria-label="Daily goal in minutes"
              value={settings.dailyGoalMinutes}
              onChange={(event) => update({ dailyGoalMinutes: Number(event.target.value) })}
              className="border-border bg-surface rounded-md border px-3 py-1.5 text-sm"
            >
              {[5, 10, 15, 20, 30, 45, 60].map((minutes) => (
                <option key={minutes} value={minutes}>
                  {minutes} minutes
                </option>
              ))}
            </select>
          </Row>

          <Row label="Accuracy target">
            <select
              aria-label="Accuracy target"
              value={settings.accuracyTarget}
              onChange={(event) => update({ accuracyTarget: Number(event.target.value) })}
              className="border-border bg-surface rounded-md border px-3 py-1.5 text-sm"
            >
              {[90, 93, 95, 97, 98, 99].map((value) => (
                <option key={value} value={value}>
                  {value}%
                </option>
              ))}
            </select>
          </Row>
        </div>

        <div className="mt-10 space-y-3">
          <Label className="text-muted-foreground text-xs tracking-[0.14em] uppercase">
            Data
          </Label>
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={reset}>
              Reset settings
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                clearAllData();
                setCleared(true);
              }}
            >
              Delete typing history
            </Button>
          </div>
          {cleared ? (
            <p className="text-muted-foreground text-sm" role="status">
              Typing history deleted from this device.
            </p>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
