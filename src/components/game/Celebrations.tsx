import { useEffect, useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/utils";

const CONFETTI_COLORS = [
  "var(--color-primary)",
  "var(--color-accent)",
  "var(--color-warning)",
  "var(--color-f9)",
  "var(--color-f6)",
];

const EFFECT_GLYPH: Record<string, string | null> = {
  "effect-confetti": null,
  "effect-stars": "\u2b50",
  "effect-hearts": "\ud83d\udc96",
};

export function Confetti({ pieces = 40, effect = "effect-confetti" }: { pieces?: number; effect?: string }) {
  const glyph = EFFECT_GLYPH[effect] ?? null;
  const bits = useMemo(
    () =>
      Array.from({ length: pieces }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 1.6 + Math.random() * 1.4,
        size: 6 + Math.random() * 8,
        color: CONFETTI_COLORS[index % CONFETTI_COLORS.length] as string,
        rotate: Math.random() * 360,
      })),
    [pieces],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {bits.map((bit) => (
        <span
          key={bit.id}
          className="confetti-bit absolute top-[-20px] block rounded-[2px] text-center leading-none"
          style={{
            left: `${bit.left}%`,
            width: glyph ? "auto" : bit.size,
            height: glyph ? "auto" : bit.size * 0.5,
            fontSize: glyph ? bit.size * 1.6 : undefined,
            background: glyph ? "transparent" : bit.color,
            animationDelay: `${bit.delay}s`,
            animationDuration: `${bit.duration}s`,
            transform: `rotate(${glyph ? 0 : bit.rotate}deg)`,
          }}
        >
          {glyph}
        </span>
      ))}
    </div>
  );
}

function CelebrationCard({
  id,
  emoji,
  title,
  subtitle,
  kind,
}: {
  id: number;
  emoji: string;
  title: string;
  subtitle: string;
  kind: "reward" | "level" | "badge";
}) {
  const { dismiss } = useGame();
  useEffect(() => {
    const timer = window.setTimeout(() => dismiss(id), kind === "reward" ? 3200 : 4600);
    return () => window.clearTimeout(timer);
  }, [id, dismiss, kind]);

  return (
    <button
      type="button"
      onClick={() => dismiss(id)}
      className={cn(
        "pop-in flex w-[min(18rem,calc(100vw-1.5rem))] items-center gap-3 rounded-2xl border p-4 text-left shadow-xl backdrop-blur",
        kind === "badge"
          ? "border-warning/50 bg-warning/15"
          : kind === "level"
            ? "border-primary/50 bg-primary/15"
            : "border-accent/50 bg-accent/15",
      )}
    >
      <span className="text-3xl leading-none">{emoji}</span>
      <span className="min-w-0">
        <span className="block text-base font-semibold">{title}</span>
        <span className="text-muted-foreground block truncate text-xs">{subtitle}</span>
      </span>
    </button>
  );
}

export function CelebrationLayer() {
  const { celebrations, shop } = useGame();
  const { settings } = useSettings();
  const showConfetti = !settings.reducedMotion && celebrations.some((c) => c.kind !== "reward");

  return (
    <>
      {showConfetti ? <Confetti effect={shop.equipped.effect} /> : null}
      <div className="pointer-events-none fixed right-3 bottom-24 z-50 flex flex-col items-end gap-3 md:right-4 md:bottom-4">
        {celebrations.map((celebration) => (
          <div key={celebration.id} className="pointer-events-auto">
            <CelebrationCard {...celebration} />
          </div>
        ))}
      </div>
    </>
  );
}
