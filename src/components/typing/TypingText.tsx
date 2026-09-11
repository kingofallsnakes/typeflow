import { memo } from "react";
import type { TypingSnapshot } from "@/core/typing/typingTypes";
import { cn } from "@/lib/utils";

interface Props {
  snapshot: TypingSnapshot;
  fontSize?: "sm" | "md" | "lg";
  caret?: "line" | "block" | "underline";
}

const SIZES: Record<string, string> = {
  sm: "text-base leading-[1.9rem] sm:text-xl sm:leading-[2.1rem]",
  md: "text-lg leading-[2.1rem] sm:text-2xl sm:leading-[2.6rem]",
  lg: "text-xl leading-[2.4rem] sm:text-3xl sm:leading-[3.1rem]",
};

function TypingTextBase({ snapshot, fontSize = "md", caret = "line" }: Props) {
  return (
    <p
      className={cn("font-mono tracking-tight break-words select-none", SIZES[fontSize])}
      aria-label="Text to type"
    >
      {snapshot.targetText.split("").map((char, index) => {
        const state = snapshot.states[index];
        const isCursor = index === snapshot.cursor;
        return (
          <span
            key={index}
            className={cn(
              "relative whitespace-pre",
              state === "pending" && "text-muted-foreground/55",
              state === "correct" && "text-foreground",
              state === "corrected" && "text-warning",
              state === "incorrect" &&
                "text-destructive underline decoration-destructive decoration-2 underline-offset-4",
              isCursor && caret === "block" && "bg-primary/30 text-foreground rounded-[3px]",
              isCursor && caret === "underline" && "border-b-2 border-primary",
            )}
          >
            {isCursor && caret === "line" && (
              <span
                aria-hidden
                className="caret-blink bg-primary absolute top-1 -left-[2px] h-[1.35em] w-[2px] rounded-full"
              />
            )}
            {char}
          </span>
        );
      })}
    </p>
  );
}

export const TypingText = memo(TypingTextBase);
