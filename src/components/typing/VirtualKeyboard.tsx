import { memo } from "react";
import { US_QWERTY, targetForChar } from "@/core/keyboard/keyboardLayouts";
import { FINGER_LABELS, FINGER_TOKEN } from "@/core/keyboard/fingerMapping";
import type { KeyDefinition } from "@/core/keyboard/keyboardTypes";
import { cn } from "@/lib/utils";

interface Props {
  nextChar?: string;
  pressedKeyCode?: string | null;
  wrongKeyCode?: string | null;
  showFingerHints?: boolean;
}

const FINGER_BG: Record<string, string> = {
  f1: "bg-f1/12 text-f1",
  f2: "bg-f2/12 text-f2",
  f3: "bg-f3/12 text-f3",
  f4: "bg-f4/12 text-f4",
  f5: "bg-f5/12 text-f5",
  f6: "bg-f6/12 text-f6",
  f7: "bg-f7/12 text-f7",
  f8: "bg-f8/12 text-f8",
  f9: "bg-f9/12 text-f9",
};

function KeyCap({
  definition,
  isTarget,
  isPressed,
  isWrong,
  showFingerHints,
}: {
  definition: KeyDefinition;
  isTarget: boolean;
  isPressed: boolean;
  isWrong: boolean;
  showFingerHints: boolean;
}) {
  const token = FINGER_TOKEN[definition.finger];
  return (
    <div
      role="presentation"
      style={{
        flexGrow: definition.width ?? 1,
        flexBasis: `calc(${definition.width ?? 1} * var(--key-basis))`,
      }}
      className={cn(
        "key-cap border-border/80 bg-elevated/70 text-muted-foreground flex h-8 min-w-0 items-center justify-center overflow-hidden rounded-md border text-[10px] font-medium transition-colors sm:h-10 sm:text-xs md:h-11 md:text-sm",
        showFingerHints && FINGER_BG[token],
        isTarget && "border-primary bg-primary/25 text-foreground ring-primary/60 ring-2",
        isWrong && "border-destructive bg-destructive/25 text-foreground",
        isPressed && !isWrong && "key-pressed border-accent bg-accent/25 text-foreground",
      )}
      title={FINGER_LABELS[definition.finger]}
    >
      {definition.keyCode === "Space" ? "space" : definition.label}
    </div>
  );
}

function VirtualKeyboardBase({
  nextChar,
  pressedKeyCode,
  wrongKeyCode,
  showFingerHints = true,
}: Props) {
  const target = nextChar ? targetForChar(nextChar) : undefined;
  return (
    <div
      className="surface-panel w-full space-y-1 p-2 sm:space-y-1.5 sm:p-3"
      style={{ ["--key-basis" as string]: "1.4rem" }}
      aria-hidden
    >
      {US_QWERTY.rows.map((row, index) => (
        <div key={index} className="flex gap-1 sm:gap-1.5">
          {row.map((definition) => (
            <KeyCap
              key={definition.keyCode}
              definition={definition}
              showFingerHints={showFingerHints}
              isTarget={
                target?.keyCode === definition.keyCode ||
                (target?.shiftRequired === true &&
                  (definition.keyCode === "ShiftLeft" || definition.keyCode === "ShiftRight") &&
                  definition.hand !== target.hand)
              }
              isPressed={pressedKeyCode === definition.keyCode}
              isWrong={wrongKeyCode === definition.keyCode}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export const VirtualKeyboard = memo(VirtualKeyboardBase);

export function FingerHint({ nextChar }: { nextChar?: string }) {
  const target = nextChar ? targetForChar(nextChar) : undefined;
  if (!target) return null;
  return (
    <p className="text-muted-foreground text-sm">
      Next key{" "}
      <span className="text-foreground font-mono">
        {nextChar === " " ? "space" : nextChar}
      </span>{" "}
      — <span className="text-foreground">{FINGER_LABELS[target.finger]}</span>
      {target.shiftRequired ? " with the opposite shift" : ""}
    </p>
  );
}
