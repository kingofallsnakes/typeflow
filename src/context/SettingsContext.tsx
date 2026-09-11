import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type Settings } from "@/core/storage/localStore";

interface SettingsContextValue {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
  ready: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function applyTheme(theme: Settings["theme"]) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const prefersLight =
    theme === "light" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: light)").matches);
  root.classList.toggle("light", prefersLight);
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = loadSettings();
    setSettings(stored);
    applyTheme(stored.theme);
    setReady(true);
  }, []);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((previous) => {
      const next = { ...previous, ...patch };
      saveSettings(next);
      applyTheme(next.theme);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    saveSettings(DEFAULT_SETTINGS);
    setSettings(DEFAULT_SETTINGS);
    applyTheme(DEFAULT_SETTINGS.theme);
  }, []);

  const value = useMemo(() => ({ settings, update, reset, ready }), [settings, update, reset, ready]);

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used inside SettingsProvider");
  return context;
}
