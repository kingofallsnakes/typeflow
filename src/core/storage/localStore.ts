import { emptyProfile, applySession, type SkillProfile } from "../adaptive/skillProfile";
import { EMPTY_GAME, type GameState } from "../game/gamification";
import type { SessionResult } from "../typing/typingTypes";
import { EMPTY_QUESTS, type QuestState } from "../game/quests";
import { normalizeShop, type ShopState } from "../game/shop";
import type { PlacementResult } from "../game/placement";

const KEY_PROFILE = "cobra.profile.v1";
const KEY_SESSIONS = "cobra.sessions.v1";
const KEY_SETTINGS = "cobra.settings.v1";
const KEY_LESSONS = "cobra.lessons.v1";
const KEY_GAME = "cobra.game.v1";

export interface Settings {
  theme: "dark" | "light" | "system";
  layout: string;
  showKeyboard: boolean;
  showFingerHints: boolean;
  showLiveMetrics: boolean;
  soundEnabled: boolean;
  fontSize: "sm" | "md" | "lg";
  caret: "line" | "block" | "underline";
  dailyGoalMinutes: number;
  accuracyTarget: number;
  reducedMotion: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  theme: "dark",
  layout: "us-qwerty",
  showKeyboard: true,
  showFingerHints: true,
  showLiveMetrics: true,
  soundEnabled: false,
  fontSize: "md",
  caret: "line",
  dailyGoalMinutes: 15,
  accuracyTarget: 97,
  reducedMotion: false,
};

export interface LessonProgress {
  lessonId: string;
  attempts: number;
  bestWpm: number;
  bestAccuracy: number;
  completed: boolean;
  lastAttemptedAt: number;
}

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

function read<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!canUseStorage()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable — typing must never break */
  }
}

export const loadProfile = (): SkillProfile => read(KEY_PROFILE, emptyProfile());
export const saveProfile = (profile: SkillProfile) => write(KEY_PROFILE, profile);

export const loadSessions = (): SessionResult[] => read<SessionResult[]>(KEY_SESSIONS, []);
export const loadSettings = (): Settings => ({
  ...DEFAULT_SETTINGS,
  ...read<Partial<Settings>>(KEY_SETTINGS, {}),
});
export const saveSettings = (settings: Settings) => write(KEY_SETTINGS, settings);

export const loadLessonProgress = (): Record<string, LessonProgress> =>
  read<Record<string, LessonProgress>>(KEY_LESSONS, {});

export function recordSession(result: SessionResult): {
  profile: SkillProfile;
  sessions: SessionResult[];
} {
  const sessions = [...loadSessions(), result].slice(-500);
  write(KEY_SESSIONS, sessions);
  const profile = applySession(loadProfile(), result);
  saveProfile(profile);
  return { profile, sessions };
}

export function recordLessonAttempt(
  lessonId: string,
  wpm: number,
  accuracy: number,
  minAccuracy: number,
): Record<string, LessonProgress> {
  const all = loadLessonProgress();
  const previous = all[lessonId];
  all[lessonId] = {
    lessonId,
    attempts: (previous?.attempts ?? 0) + 1,
    bestWpm: Math.max(previous?.bestWpm ?? 0, wpm),
    bestAccuracy: Math.max(previous?.bestAccuracy ?? 0, accuracy),
    completed: (previous?.completed ?? false) || accuracy >= minAccuracy,
    lastAttemptedAt: Date.now(),
  };
  write(KEY_LESSONS, all);
  return all;
}

export const loadGame = (): GameState => ({
  ...EMPTY_GAME,
  ...read<Partial<GameState>>(KEY_GAME, {}),
});
export const saveGame = (game: GameState) => write(KEY_GAME, game);

export function clearAllData(): void {
  if (!canUseStorage()) return;
  [KEY_PROFILE, KEY_SESSIONS, KEY_LESSONS, KEY_GAME, "cobra.quests.v1", "cobra.shop.v1", "cobra.placement.v1"].forEach((key) =>
    window.localStorage.removeItem(key),
  );
}

/* ---------------------------------------------------------------- quests, shop, placement */

const KEY_QUESTS = "cobra.quests.v1";
const KEY_SHOP = "cobra.shop.v1";
const KEY_PLACEMENT = "cobra.placement.v1";

export const loadQuests = (): QuestState => read<QuestState>(KEY_QUESTS, EMPTY_QUESTS);
export const saveQuests = (state: QuestState) => write(KEY_QUESTS, state);

export const loadShop = (): ShopState => normalizeShop(read<Partial<ShopState>>(KEY_SHOP, {}));
export const saveShop = (state: ShopState) => write(KEY_SHOP, state);

export const loadPlacement = (): Partial<PlacementResult> =>
  read<Partial<PlacementResult>>(KEY_PLACEMENT, {});
export const savePlacement = (result: PlacementResult) => write(KEY_PLACEMENT, result);

export interface PlayerSnapshot {
  game: GameState;
  lessons: Record<string, LessonProgress>;
  quests: QuestState;
  shop: ShopState;
  placement: Partial<PlacementResult>;
  profile: SkillProfile;
  sessions: SessionResult[];
}

export function exportSnapshot(): PlayerSnapshot {
  return {
    game: loadGame(),
    lessons: loadLessonProgress(),
    quests: loadQuests(),
    shop: loadShop(),
    placement: loadPlacement(),
    profile: loadProfile(),
    sessions: loadSessions().slice(-200),
  };
}

export function importSnapshot(snapshot: Partial<PlayerSnapshot>): void {
  if (snapshot.game) write(KEY_GAME, { ...EMPTY_GAME, ...snapshot.game });
  if (snapshot.lessons) write(KEY_LESSONS, snapshot.lessons);
  if (snapshot.quests) write(KEY_QUESTS, snapshot.quests);
  if (snapshot.shop) write(KEY_SHOP, normalizeShop(snapshot.shop));
  if (snapshot.placement) write(KEY_PLACEMENT, snapshot.placement);
  if (snapshot.profile) write(KEY_PROFILE, snapshot.profile);
  if (snapshot.sessions) write(KEY_SESSIONS, snapshot.sessions);
}
