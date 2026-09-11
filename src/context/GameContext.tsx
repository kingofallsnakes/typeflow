import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  BADGES,
  EMPTY_GAME,
  dayKey,
  levelForXp,
  levelInfo,
  rewardForSession,
  streakFromDays,
  type Badge,
  type BadgeContext as BadgeCtx,
  type GameState,
  type SessionReward,
} from "@/core/game/gamification";
import {
  applySessionToQuests,
  ensureToday,
  questComplete,
  EMPTY_QUESTS,
  type Quest,
  type QuestState,
} from "@/core/game/quests";
import {
  EMPTY_SHOP,
  itemById,
  normalizeShop,
  type ShopCategory,
  type ShopState,
} from "@/core/game/shop";
import { EMPTY_PLACEMENT, type PlacementResult } from "@/core/game/placement";
import {
  loadGame,
  loadLessonProgress,
  loadPlacement,
  loadQuests,
  loadSessions,
  loadShop,
  saveGame,
  savePlacement,
  saveQuests,
  saveShop,
} from "@/core/storage/localStore";
import type { SessionResult } from "@/core/typing/typingTypes";
import { useSettings } from "./SettingsContext";
import { useAuth } from "./AuthContext";
import { sfx, setSoundEnabled, setSoundProfile } from "@/lib/sfx";
import { syncDown, syncUp } from "@/lib/cloudSync";

export interface Celebration {
  id: number;
  kind: "reward" | "level" | "badge";
  title: string;
  subtitle: string;
  emoji: string;
}

interface GameContextValue {
  game: GameState;
  streak: number;
  level: ReturnType<typeof levelInfo>;
  badgeContext: BadgeCtx;
  celebrations: Celebration[];
  lastReward: SessionReward | null;
  quests: QuestState;
  shop: ShopState;
  placement: Partial<PlacementResult>;
  dismiss: (id: number) => void;
  awardSession: (result: SessionResult) => SessionReward;
  claimQuest: (questId: string) => void;
  buyItem: (itemId: string) => { ok: boolean; reason?: string };
  equipItem: (itemId: string) => void;
  savePlacementResult: (result: PlacementResult) => void;
  celebrate: (celebration: Omit<Celebration, "id">) => void;
  syncing: boolean;
  ready: boolean;
}

const GameContext = createContext<GameContextValue | null>(null);

function buildBadgeContext(game: GameState): BadgeCtx {
  const sessions = loadSessions();
  const lessons = Object.values(loadLessonProgress());
  return {
    sessions: sessions.length,
    characters: sessions.reduce((total, s) => total + s.metrics.totalKeystrokes, 0),
    bestWpm: sessions.reduce((best, s) => Math.max(best, s.metrics.wpm), 0),
    bestAccuracy: sessions.reduce((best, s) => Math.max(best, s.metrics.accuracy), 0),
    lessonsCompleted: lessons.filter((lesson) => lesson.completed).length,
    streak: streakFromDays(game.days),
    level: levelForXp(game.xp),
    coins: game.coins,
  };
}

function applySkin(shop: ShopState) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset["theme"] = shop.equipped.theme;
  root.dataset["keys"] = shop.equipped.keyboard;
  setSoundProfile(shop.equipped.sound);
}

export function GameProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const { user } = useAuth();
  const [game, setGame] = useState<GameState>(EMPTY_GAME);
  const [quests, setQuests] = useState<QuestState>(EMPTY_QUESTS);
  const [shop, setShop] = useState<ShopState>(EMPTY_SHOP);
  const [placement, setPlacement] = useState<Partial<PlacementResult>>(EMPTY_PLACEMENT);
  const [badgeContext, setBadgeContext] = useState<BadgeCtx>(() => ({
    sessions: 0,
    characters: 0,
    bestWpm: 0,
    bestAccuracy: 0,
    lessonsCompleted: 0,
    streak: 0,
    level: 1,
    coins: 0,
  }));
  const [celebrations, setCelebrations] = useState<Celebration[]>([]);
  const [lastReward, setLastReward] = useState<SessionReward | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [ready, setReady] = useState(false);
  const userRef = useRef<string | null>(null);

  const readLocal = useCallback(() => {
    const storedGame = loadGame();
    const storedQuests = ensureToday(loadQuests());
    const storedShop = loadShop();
    setGame(storedGame);
    setQuests(storedQuests);
    saveQuests(storedQuests);
    setShop(storedShop);
    setPlacement(loadPlacement());
    setBadgeContext(buildBadgeContext(storedGame));
    applySkin(storedShop);
  }, []);

  useEffect(() => {
    readLocal();
    setReady(true);
  }, [readLocal]);

  useEffect(() => {
    setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Cloud save: pull on sign-in, then keep the cloud up to date.
  useEffect(() => {
    if (!user) {
      userRef.current = null;
      return;
    }
    if (userRef.current === user.id) return;
    userRef.current = user.id;
    setSyncing(true);
    void syncDown(user.id)
      .then(() => readLocal())
      .finally(() => setSyncing(false));
  }, [user, readLocal]);

  const push = useCallback(() => {
    if (userRef.current) void syncUp(userRef.current);
  }, []);

  const celebrate = useCallback((celebration: Omit<Celebration, "id">) => {
    setCelebrations((list) => [...list, { ...celebration, id: Date.now() + Math.random() }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setCelebrations((list) => list.filter((item) => item.id !== id));
  }, []);

  const awardSession = useCallback(
    (result: SessionResult): SessionReward => {
      const previous = loadGame();
      const streak = streakFromDays(previous.days);
      const reward = rewardForSession(result, streak);

      const days = previous.days.includes(dayKey(result.finishedAt))
        ? previous.days
        : [...previous.days, dayKey(result.finishedAt)].slice(-400);
      const next: GameState = {
        ...previous,
        xp: previous.xp + reward.xp,
        coins: previous.coins + reward.coins,
        days,
        bestStreak: Math.max(previous.bestStreak, streakFromDays(days)),
      };

      const beforeLevel = levelForXp(previous.xp);
      const afterLevel = levelForXp(next.xp);
      const context = buildBadgeContext(next);
      const newlyEarned: Badge[] = BADGES.filter(
        (badge) => badge.reached(context) >= badge.goal && !previous.seenBadges.includes(badge.code),
      );
      next.seenBadges = [...previous.seenBadges, ...newlyEarned.map((badge) => badge.code)];

      saveGame(next);
      setGame(next);
      setLastReward(reward);
      setBadgeContext(context);

      const lessonCompleted = Boolean(
        result.lessonId && loadLessonProgress()[result.lessonId]?.completed,
      );
      const nextQuests = applySessionToQuests(ensureToday(loadQuests()), result, lessonCompleted);
      saveQuests(nextQuests);
      setQuests(nextQuests);

      celebrate({
        kind: "reward",
        emoji: "✨",
        title: `+${reward.xp} XP`,
        subtitle: `+${reward.coins} coins earned`,
      });
      if (afterLevel > beforeLevel) {
        celebrate({
          kind: "level",
          emoji: "🎉",
          title: `Level ${afterLevel}!`,
          subtitle: levelInfo(next.xp).title,
        });
      }
      newlyEarned.forEach((badge) =>
        celebrate({
          kind: "badge",
          emoji: badge.emoji,
          title: badge.title,
          subtitle: badge.description,
        }),
      );

      if (settings.soundEnabled) {
        if (newlyEarned.length) sfx.badge();
        else if (afterLevel > beforeLevel) sfx.levelUp();
        else sfx.reward();
      }

      push();
      return reward;
    },
    [celebrate, settings.soundEnabled, push],
  );

  const claimQuest = useCallback(
    (questId: string) => {
      const state = ensureToday(loadQuests());
      const quest: Quest | undefined = state.quests.find((item) => item.id === questId);
      if (!quest || quest.claimed || !questComplete(quest)) return;

      const nextQuests: QuestState = {
        ...state,
        quests: state.quests.map((item) =>
          item.id === questId ? { ...item, claimed: true } : item,
        ),
      };
      saveQuests(nextQuests);
      setQuests(nextQuests);

      const previous = loadGame();
      const next: GameState = {
        ...previous,
        xp: previous.xp + quest.xp,
        coins: previous.coins + quest.coins,
      };
      saveGame(next);
      setGame(next);
      setBadgeContext(buildBadgeContext(next));
      celebrate({
        kind: "reward",
        emoji: quest.emoji,
        title: `Quest done! +${quest.xp} XP`,
        subtitle: `+${quest.coins} coins`,
      });
      if (settings.soundEnabled) sfx.reward();
      push();
    },
    [celebrate, settings.soundEnabled, push],
  );

  const buyItem = useCallback(
    (itemId: string): { ok: boolean; reason?: string } => {
      const item = itemById(itemId);
      if (!item) return { ok: false, reason: "Unknown item" };
      const currentShop = loadShop();
      if (currentShop.owned.includes(itemId)) return { ok: false, reason: "Already yours" };
      const previous = loadGame();
      if (levelForXp(previous.xp) < item.level)
        return { ok: false, reason: `Reach level ${item.level} first` };
      if (previous.coins < item.price) return { ok: false, reason: "Not enough coins" };

      const nextGame: GameState = { ...previous, coins: previous.coins - item.price };
      const nextShop = normalizeShop({
        owned: [...currentShop.owned, itemId],
        equipped: { ...currentShop.equipped, [item.category]: itemId },
      });
      saveGame(nextGame);
      saveShop(nextShop);
      setGame(nextGame);
      setShop(nextShop);
      setBadgeContext(buildBadgeContext(nextGame));
      applySkin(nextShop);
      celebrate({
        kind: "badge",
        emoji: item.emoji,
        title: `${item.name} unlocked`,
        subtitle: "Equipped and ready to use",
      });
      if (settings.soundEnabled) sfx.badge();
      push();
      return { ok: true };
    },
    [celebrate, settings.soundEnabled, push],
  );

  const equipItem = useCallback(
    (itemId: string) => {
      const item = itemById(itemId);
      if (!item) return;
      const currentShop = loadShop();
      if (!currentShop.owned.includes(itemId)) return;
      const nextShop = normalizeShop({
        owned: currentShop.owned,
        equipped: { ...currentShop.equipped, [item.category as ShopCategory]: itemId },
      });
      saveShop(nextShop);
      setShop(nextShop);
      applySkin(nextShop);
      push();
    },
    [push],
  );

  const savePlacementResult = useCallback(
    (result: PlacementResult) => {
      savePlacement(result);
      setPlacement(result);
      push();
    },
    [push],
  );

  const value = useMemo<GameContextValue>(
    () => ({
      game,
      streak: streakFromDays(game.days),
      level: levelInfo(game.xp),
      badgeContext,
      celebrations,
      lastReward,
      quests,
      shop,
      placement,
      dismiss,
      awardSession,
      claimQuest,
      buyItem,
      equipItem,
      savePlacementResult,
      celebrate,
      syncing,
      ready,
    }),
    [
      game,
      badgeContext,
      celebrations,
      lastReward,
      quests,
      shop,
      placement,
      dismiss,
      awardSession,
      claimQuest,
      buyItem,
      equipItem,
      savePlacementResult,
      celebrate,
      syncing,
      ready,
    ],
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const context = useContext(GameContext);
  if (!context) throw new Error("useGame must be used inside GameProvider");
  return context;
}
