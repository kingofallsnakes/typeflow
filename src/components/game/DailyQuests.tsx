import { Gift } from "lucide-react";
import { useGame } from "@/context/GameContext";
import { questComplete, questPercent } from "@/core/game/quests";
import { Button } from "@/components/ui/button";

export function DailyQuests() {
  const { quests, claimQuest } = useGame();
  if (!quests.quests.length) return null;

  return (
    <section className="glow-card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Gift className="text-accent size-5" aria-hidden />
        <h2 className="text-lg font-semibold">Today's quests</h2>
      </div>
      <ul className="mt-4 space-y-3">
        {quests.quests.map((quest) => {
          const done = questComplete(quest);
          return (
            <li key={quest.id} className="bg-surface rounded-xl p-3">
              <div className="flex items-center gap-3">
                <span className="text-xl" aria-hidden>
                  {quest.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{quest.title}</p>
                  <p className="text-muted-foreground text-xs">
                    +{quest.xp} XP · +{quest.coins} coins
                  </p>
                </div>
                {quest.claimed ? (
                  <span className="text-accent text-xs font-medium">Claimed ✓</span>
                ) : done ? (
                  <Button size="sm" onClick={() => claimQuest(quest.id)}>
                    Claim
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-xs">
                    {Math.floor(quest.progress)}/{quest.goal}
                  </span>
                )}
              </div>
              <span className="bg-elevated mt-2 block h-1.5 overflow-hidden rounded-full">
                <span
                  className="from-primary to-accent block h-full bg-gradient-to-r transition-[width] duration-500"
                  style={{ width: `${questPercent(quest)}%` }}
                />
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
