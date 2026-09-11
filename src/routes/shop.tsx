import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Coins, Lock } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useGame } from "@/context/GameContext";
import { CATEGORY_LABEL, SHOP_ITEMS, type ShopCategory } from "@/core/game/shop";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Coin shop — TYPEFLOW" },
      {
        name: "description",
        content: "Spend the coins you earn on colour themes, keyboard skins, sound packs and celebrations.",
      },
      { property: "og:title", content: "Coin shop — TYPEFLOW" },
      {
        property: "og:description",
        content: "Unlock themes, keyboard skins, sound packs and celebration effects with your coins.",
      },
    ],
  }),
  component: ShopPage,
});

const ORDER: ShopCategory[] = ["theme", "keyboard", "sound", "effect"];

function ShopPage() {
  const { game, shop, level, buyItem, equipItem } = useGame();
  const [notice, setNotice] = useState<string | null>(null);

  return (
    <AppShell>
      <div className="space-y-8">
        <header className="glow-card flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6">
          <div>
            <h1 className="text-balance-tight text-2xl font-semibold sm:text-3xl">Coin shop</h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Earn coins by practising, then make TYPEFLOW look and sound the way you like.
            </p>
          </div>
          <div className="border-warning/40 bg-warning/10 flex items-center gap-2 rounded-full border px-4 py-2">
            <Coins className="text-warning size-5" aria-hidden />
            <span className="font-semibold">{game.coins}</span>
          </div>
        </header>

        {notice && <p className="text-warning text-sm">{notice}</p>}

        {ORDER.map((category) => (
          <section key={category}>
            <h2 className="text-lg font-semibold">{CATEGORY_LABEL[category]}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {SHOP_ITEMS.filter((item) => item.category === category).map((item) => {
                const owned = shop.owned.includes(item.id);
                const equipped = shop.equipped[category] === item.id;
                const locked = level.level < item.level;
                return (
                  <article
                    key={item.id}
                    className={`glow-card flex flex-col gap-3 p-4 ${equipped ? "ring-primary ring-2" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl text-lg"
                        style={item.swatch ? { background: item.swatch } : undefined}
                      >
                        {item.emoji}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-muted-foreground truncate text-xs">{item.description}</p>
                      </div>
                    </div>

                    {equipped ? (
                      <Button variant="outline" disabled className="w-full">
                        <Check className="size-4" aria-hidden /> In use
                      </Button>
                    ) : owned ? (
                      <Button variant="outline" className="w-full" onClick={() => equipItem(item.id)}>
                        Use this
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        disabled={locked}
                        onClick={() => {
                          const result = buyItem(item.id);
                          setNotice(result.ok ? null : (result.reason ?? null));
                        }}
                      >
                        {locked ? (
                          <>
                            <Lock className="size-4" aria-hidden /> Level {item.level}
                          </>
                        ) : (
                          <>
                            <Coins className="size-4" aria-hidden /> {item.price}
                          </>
                        )}
                      </Button>
                    )}
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
